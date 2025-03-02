const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: { type: String, required: true },
    mediaURLs: [{ type: String }], // Optional array of image/video URLs
    // e.g., an array if you allow multiple images in a single post
    // or a single field if you only want one image/video

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
