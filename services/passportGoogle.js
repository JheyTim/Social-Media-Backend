const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extract info from Google profile
        const email = profile.emails[0].value;
        const name = profile.displayName;

        // Check if user already exists
        let user = await User.findOne({ email });

        // If not, create a new user
        if (!user) {
          user = new User({ email, name });
          await user.save();
        }

        // Passport callback: attach user to req.user
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
