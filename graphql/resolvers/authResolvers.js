const User = require('../../models/User');
const { generateToken } = require('../../utils/auth');

exports.authResolvers = {
  Query: {},
  Mutation: {
    // Signup
    signup: async (_, { email, password, name }) => {
      // Check if user exists
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        throw new Error('User already exists with that email.');
      }

      // Create and save user
      const newUser = new User({
        email,
        password,
        name,
      });

      await newUser.save();

      const token = generateToken(newUser);

      return {
        token,
        user: newUser,
      };
    },

    // Login
    login: async (_, { email, password }) => {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        throw new Error('No user found with this email.');
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        throw new Error('Invalid credentials.');
      }

      // Generate token
      const token = generateToken(user);

      return {
        token,
        user,
      };
    },
  },
};
