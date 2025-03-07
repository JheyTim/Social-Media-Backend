const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reportedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reason: { type: String, required: true }, // e.g. "Spam", "Harassment", etc.
    status: {
      type: String,
      enum: ['open', 'resolved', 'rejected'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
