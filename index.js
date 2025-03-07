require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const cors = require('cors');
const express = require('express');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const logger = require('./utils/logger');
const connectDB = require('./config/db');
const User = require('./models/User');
const { schema } = require('./graphql/schema');
const { generateToken } = require('./utils/auth');

require('./services/passportGoogle');

(async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app = express();

  app.use(cors());

  // Initialize passport
  app.use(passport.initialize());

  app.get('/health', (req, res) => res.send('OK'));

  // Google OAuth route (redirects user to Google)
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
    })
  );

  // Google OAuth callback route
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    async (req, res) => {
      // At this point, `req.user` is set by passportGoogle.js
      const user = req.user;

      // Generate an internal JWT
      const token = generateToken(user);

      // Redirect to your frontend with the token
      // e.g., "https://your-frontend.com?token=..."
      // For now, we are only returing token
      res.json({ token });
    }
  );

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      // Extract token from headers
      const token = req.headers.authorization;

      if (token) {
        try {
          // Verify token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const authUser = await User.findById(decoded.userId);

          if (authUser.isBanned) {
            throw new Error('User is banned.');
          }

          return { authUser };
        } catch (error) {
          // Token is invalid or expired
          logger.error('Token error:', error);

          throw new Error('Token is invalid, expired or User is Banned.');
        }
      }

      // Return context object
      return {};
    },
    formatError: (err) => {
      logger.error(`GraphQL Error: ${err.message}`, { details: err });

      return {
        message: err.message || 'An unexpected error occurred.',
        statusCode: err.extensions?.code || 500,
        path: err.path || null, // Include the GraphQL path where the error occurred
      };
    },
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  // Create HTTP server and attach the express app
  const httpServer = createServer(app);

  // Set up Subscription Server with subscriptions-transport-ws
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
      onConnect: async (connectionParams) => {
        // parse token from connectionParams for auth in subscriptions
        if (connectionParams.authorization) {
          try {
            const decoded = jwt.verify(
              connectionParams.authorization,
              process.env.JWT_SECRET
            );
            const authUser = await User.findById(decoded.userId);

            if (authUser.isBanned) {
              throw new Error('User is banned.');
            }

            return { authUser };
          } catch (err) {
            console.error('Subscription auth error', err);

            throw new Error('Token is invalid, expired or User is Banned.');
          }
        }
        return {};
      },
    },
    { server: httpServer, path: server.graphqlPath }
  );

  // Listen on a port
  const PORT = process.env.PORT;
  httpServer.listen(PORT, () => {
    logger.info(
      `Server is running at http://localhost:${PORT}${server.graphqlPath}`
    );
    logger.info(
      `Subscriptions ready at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
