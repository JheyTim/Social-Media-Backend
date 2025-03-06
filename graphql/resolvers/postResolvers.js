const Post = require('../../models/Post');
const pubsub = require('../pubsub');
const { requireAuth } = require('../../utils/requireAuth');

const NEW_POST = 'NEW_POST'; // subscription trigger name

exports.postResolvers = {
  Subscription: {
    newPost: {
      subscribe: () => pubsub.asyncIterableIterator([NEW_POST]),
    },
  },
  Post: {
    likeCount: (parent) => {
      // `parent` is the Post object
      return parent.likes ? parent.likes.length : 0;
    },
  },
  Query: {
    getPost: async (_, { postId }) => {
      const post = await Post.findById(postId).populate('author');
      if (!post) throw new Error('Post not found');
      return post;
    },

    getAllPosts: async () => {
      // Simple example: no pagination
      return Post.find().populate('author').sort({ createdAt: -1 });
    },

    // Example of offset-based pagination
    getPostsPaginated: async (_, { limit = 10, offset = 0 }) => {
      const posts = await Post.find()
        .populate('author')
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

      return posts;
    },
  },
  Mutation: {
    createPost: async (_, { content, mediaURLs }, { authUser }) => {
      requireAuth(authUser);

      // Create new post
      const newPost = new Post({
        author: authUser._id,
        content,
        mediaURLs: mediaURLs || [],
      });

      await newPost.save();

      // Populate author if needed
      const postWithAuthor = await Post.findById(newPost._id).populate(
        'author'
      );

      // Publish event so subscribers get the new post in real-time
      pubsub.publish(NEW_POST, { newPost: postWithAuthor });

      return postWithAuthor;
    },

    editPost: async (_, { postId, content }, { authUser }) => {
      requireAuth(authUser);

      // Fetch the post
      const post = await Post.findById(postId);

      if (!post) throw new Error('Post not found');

      // Ensure the logged-in user is the authro
      if (post.author.toString() !== authUser._id.toString()) {
        throw new Error('Not authorized to edit this post');
      }

      // Update content
      post.content = content;
      await post.save();

      return post;
    },

    deletePost: async (_, { postId }, { authUser }) => {
      requireAuth(authUser);

      // Fetch the post
      const post = await Post.findById(postId);

      if (!post) throw new Error('Post not found');

      if (post.author.toString() !== authUser._id.toString()) {
        throw new Error('Not authorized to delete this post.');
      }

      await Post.deleteOne({ _id: postId });
      return { success: true };
    },

    likePost: async (_, { postId }, { authUser }) => {
      requireAuth(authUser);

      const post = await Post.findById(postId);

      if (!post) throw new Error('Post not found');

      // Check if already liked
      const isLiked = post.likes?.includes(authUser._id);

      if (isLiked) {
        throw new Error('You already liked this post.');
      }

      post.likes.push(authUser._id);
      await post.save();

      return post;
    },

    unlikePost: async (_, { postId }, { authUser }) => {
      requireAuth(authUser);

      const post = await Post.findById(postId);
      if (!post) throw new Error('Post not found');

      // Check if user has liked
      const isLiked = post.likes?.includes(authUser._id);
      if (!isLiked) {
        throw new Error('You have not liked this post');
      }

      post.likes = post.likes.filter(
        (userId) => userId.toString() !== authUser._id.toString()
      );
      await post.save();

      return post;
    },
  },
};
