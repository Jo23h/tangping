const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

const callbackURL = process.env.BACKEND_URL
  ? `${process.env.BACKEND_URL}/auth/google/callback`
  : '/auth/google/callback';

console.log("=== PASSPORT CONFIG ===");
console.log("Google OAuth Callback URL:", callbackURL);
console.log("Proxy enabled: true");
console.log("======================");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL,
    proxy: true,  // CRITICAL: Trust Railway's proxy
    accessType: 'offline',  // Request refresh token
    prompt: 'consent'  // Force consent screen to get refresh token
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ googleId: profile.id });

      if (user) {
        // User exists, update tokens
        user.googleAccessToken = accessToken;
        if (refreshToken) {
          user.googleRefreshToken = refreshToken;
        }
        await user.save();
        return done(null, user);
      }

      // Create new user
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken,
        role: 'user'
      });

      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
