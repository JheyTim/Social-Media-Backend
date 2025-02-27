const User = require('../models/User');

const resolvers = {
  Query: {
    hello: () => 'Hello, Social Media!',
  },
  Mutation: {
    createTestUser: async (_, { email, name }) => {
      const newUser = new User({ email, name });
      await newUser.save();
      return newUser;
    },
  },
};

module.exports = resolvers;
