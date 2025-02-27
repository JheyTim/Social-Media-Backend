require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const logger = require('./utils/logger');
const connectDB = require('./config/db');

// Connect to MongoDB

(async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Create an instance of ApolloServer
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      // You can attach user info or DB connections here for each request
      return { req };
    },
    formatError: (err) => {
      // Log the error for debugging
      logger.error(err);

      // Return the formatted error
      return {
        message: err.message,
        statusCode: err.extensions?.code || 500,
      };
    },
  });

  // Start the server
  server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    logger.info(`Server running at ${url}`);
  });
})();
