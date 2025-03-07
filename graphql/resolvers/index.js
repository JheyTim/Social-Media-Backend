const { authResolvers } = require('./authResolvers');
const { profileResolvers } = require('./profileResolvers');
const { postResolvers } = require('./postResolvers');
const { notificationResolvers } = require('./notificationResolvers');
const { adminResolvers } = require('./adminResolvers');
const { reportResolvers } = require('./reportResolvers');

exports.resolvers = {
  Subscription: {
    ...postResolvers.Subscription,
    ...notificationResolvers.Subscription,
  },
  Post: {
    ...postResolvers.Post,
  },
  Query: {
    ...profileResolvers.Query,
    ...postResolvers.Query,
    ...notificationResolvers.Query,
    ...adminResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...profileResolvers.Mutation,
    ...postResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...adminResolvers.Mutation,
    ...reportResolvers.Mutation,
  },
};
