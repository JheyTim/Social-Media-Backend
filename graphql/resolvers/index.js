const { authResolvers } = require('./authResolvers');
const { profileResolvers } = require('./profileResolvers');

exports.resolvers = {
  Query: {
    ...authResolvers.Query,
    ...profileResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...profileResolvers.Mutation,
  },
};
