const User = require('../../models/User');
const Post = require('../../models/Post');
const Report = require('../../models/Report');
const { requireAdmin } = require('../../utils/requireAuth');

exports.adminResolvers = {
  Query: {
    getAllReports: async (_, __, { authUser }) => {
      requireAdmin(authUser);
      return Report.find()
        .populate('reporter')
        .populate('reportedUser')
        .populate('reportedPost');
    },
    getOpenReports: async (_, __, { authUser }) => {
      requireAdmin(authUser);
      return Report.find({ status: 'open' })
        .populate('reporter')
        .populate('reportedUser')
        .populate('reportedPost');
    },
  },
  Mutation: {
    banUser: async (_, { userId }, { authUser }) => {
      requireAdmin(authUser);

      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      user.isBanned = true;
      await user.save();

      return { success: true };
    },
    unbanUser: async (_, { userId }, { authUser }) => {
      requireAdmin(authUser);

      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      user.isBanned = false;
      await user.save();

      return { success: true };
    },

    deletePostAsAdmin: async (_, { postId }, { authUser }) => {
      requireAdmin(authUser);

      const post = await Post.findById(postId);

      if (!post) {
        throw new Error('Post not found');
      }

      await Post.deleteOne({ _id: postId });

      return { success: true };
    },

    resolveReport: async (_, { reportId }, { authUser }) => {
      requireAdmin(authUser);

      const report = await Report.findById(reportId);
      if (!report) throw new Error('Report not found');

      report.status = 'resolved';
      await report.save();

      return report;
    },

    rejectReport: async (_, { reportId }, { authUser }) => {
      requireAdmin(authUser);

      const report = await Report.findById(reportId);
      if (!report) throw new Error('Report not found');

      report.status = 'rejected';
      await report.save();

      return report;
    },
  },
};
