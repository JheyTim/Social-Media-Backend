const Report = require('../../models/Report');
const { requireAuth } = require('../../utils/requireAuth');

exports.reportResolvers = {
  Mutation: {
    reportUser: async (_, { reportedUserId, reason }, { authUser }) => {
      requireAuth(authUser);

      const newReport = new Report({
        reporter: authUser._id,
        reportedUser: reportedUserId,
        reason,
      });

      await newReport.save();

      return newReport;
    },
    reportPost: async (_, { reportedPostId, reason }, { authUser }) => {
      requireAuth(authUser);

      const newReport = new Report({
        reporter: authUser._id,
        reportedPost: reportedPostId,
        reason,
      });

      await newReport.save();

      return newReport;
    },
  },
};
