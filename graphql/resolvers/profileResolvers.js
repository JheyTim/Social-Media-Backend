const User = require('../../models/User');
const Notification = require('../../models/Notification');
const { requireAuth } = require('../../utils/requireAuth');
const pubsub = require('../pubsub');

const NEW_NOTIFICATION = 'NEW_NOTIFICATION';

exports.profileResolvers = {
  Query: {
    // Fetch user profile by ID
    getUserProfile: async (_, { userId }) => {
      const user = await User.findById(userId);

      if (!user) throw new Error('User not found');

      return user;
    },

    // Fetch the currently logged-in user's profile
    getCurrentUserProfile: async (_, __, { authUser }) => {
      // Ensure user is logged in
      requireAuth(authUser);

      const user = await User.findById(authUser._id);

      if (!user) throw new Error('User not found');

      return user;
    },

    getFollowers: async (_, { userId }) => {
      const user = await User.findById(userId).populate('followers');
      if (!user) throw new Error('User not found');
      return user.followers; // array of populated user docs
    },

    getFollowing: async (_, { userId }) => {
      const user = await User.findById(userId).populate('following');
      if (!user) throw new Error('User not found');
      return user.following; // array of populated user docs
    },
  },

  Mutation: {
    // Update the current user's profile
    updateProfile: async (_, { input }, { authUser }) => {
      // Ensure user is logged in
      requireAuth(authUser);

      // e.g., { name, bio, website, profilePicture, location }
      const updatedUser = await User.findByIdAndUpdate(
        authUser._id,
        {
          ...input,
        },
        { new: true }
      );

      return updatedUser;
    },

    followUser: async (_, { userToFollowId }, { authUser }) => {
      requireAuth(authUser);

      // Ensure userToFollowId is not the same as current user
      if (authUser._id.toString() === userToFollowId) {
        throw new Error("You can't follow yourself!");
      }

      // Find current user and user to follow

      const [currentUser, userToFollow] = await Promise.all([
        User.findById(authUser._id),
        User.findById(userToFollowId),
      ]);

      if (!userToFollow) {
        throw new Error('User to follow not found');
      }

      // Check if already following
      const alreadyFollowing = currentUser.following.includes(userToFollowId);

      if (alreadyFollowing) {
        throw new Error('You are already following this user.');
      }

      // Add to following/followers
      currentUser.following.push(userToFollowId);
      userToFollow.followers.push(authUser._id);

      // Save both
      await currentUser.save();
      await userToFollow.save();

      const notification = new Notification({
        type: 'FOLLOW',
        sender: authUser._id,
        receiver: userToFollowId,
      });

      await notification.save();

      // Publish
      const populatedNotification = await Notification.findById(
        notification._id
      )
        .populate('sender')
        .populate('receiver');

      pubsub.publish(NEW_NOTIFICATION, {
        newNotification: populatedNotification,
        receiverId: userToFollowId,
      });

      return { success: true };
    },

    unfollowUser: async (_, { userToUnfollowId }, { authUser }) => {
      requireAuth(authUser);

      const [currentUser, userToUnfollow] = await Promise.all([
        User.findById(authUser._id),
        User.findById(userToUnfollowId),
      ]);

      if (!userToUnfollow) {
        throw new Error('User to unfollow not found');
      }

      // Check if currently following
      const isFollowing = currentUser.following.includes(userToUnfollowId);
      if (!isFollowing) {
        throw new Error('You are not following this user');
      }

      // Remove from following/followers
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToUnfollowId
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== authUser._id.toString()
      );

      await currentUser.save();
      await userToUnfollow.save();

      return { success: true };
    },
  },
};
