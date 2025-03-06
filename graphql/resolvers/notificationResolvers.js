const { withFilter } = require('graphql-subscriptions');
const Notification = require('../../models/Notification');
const pubsub = require('../pubsub');
const { requireAuth } = require('../../utils/requireAuth');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

exports.notificationResolvers = {
  Subscription: {
    newNotification: {
      subscribe: withFilter(
        () => pubsub.asyncIterableIterator([NEW_NOTIFICATION]),
        (payload, variables, context) => {
          // 'payload' has { newNotification, receiverId }
          // 'context.authUser' is the subscribed user
          return (
            payload.receiverId.toString() === context.authUser._id.toString()
          );
        }
      ),
    },
  },
  Query: {
    getUserNotifications: async (_, __, { authUser }) => {
      requireAuth(authUser);
      return Notification.find({ receiver: authUser._id })
        .populate('sender')
        .populate('receiver')
        .populate('post');
    },
  },
  Mutation: {
    markNotificationRead: async (_, { notificationId }, { authUser }) => {
      requireAuth(authUser);

      const notif = await Notification.findById(notificationId);
      if (!notif) throw new Error('Notification not found');
      if (notif.receiver.toString() !== authUser._id.toString()) {
        throw new Error('Not authorized to mark this notification');
      }

      notif.read = true;
      await notif.save();
      return notif;
    },
  },
};
