const { authResolvers } = require('./authResolvers');
const { profileResolvers } = require('./profileResolvers');
const { postResolvers } = require('./postResolvers');
const { notificationResolvers } = require('./notificationResolvers');

exports.resolvers = {
  Subscription: {
    ...postResolvers.Subscription,
    ...notificationResolvers.Subscription,
  },
  Post: {
    ...postResolvers.Post,
  },
  Query: {
    ...authResolvers.Query,
    ...profileResolvers.Query,
    ...postResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...postResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
};
