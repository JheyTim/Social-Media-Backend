require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const cors = require('cors');
const express = require('express');
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
          return { authUser };
        } catch (error) {
          // Token is invalid or expired
          logger.error('Token error:', error);

          throw new Error('Token is invalid or expired.');
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

  // Listen on a port
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    logger.info(
      `Server listening at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
