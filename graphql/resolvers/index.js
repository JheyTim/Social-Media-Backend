const { authResolvers } = require('./authResolvers');
const { profileResolvers } = require('./profileResolvers');
const { postResolvers } = require('./postResolvers');

exports.resolvers = {
  Post: {
    ...postResolvers.Post,
  },
  Query: {
    ...authResolvers.Query,
    ...profileResolvers.Query,
    ...postResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...postResolvers.Mutation,
  },
};
