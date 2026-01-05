const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { signUp, signIn, signOut, guestSignIn, googleCallback } = require('../controllers/auth')

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.post('/guest', guestSignIn)

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log("=== Starting Google Auth Flow ===");
  console.log("Request URL:", req.url);
  console.log("Request Protocol:", req.protocol);
  console.log("Request Host:", req.get('host'));
  next();
}, passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/drive.file'  // Access to create and manage files
  ],
  session: false,
  state: false
}))

router.get('/google/callback', (req, res, next) => {
  console.log("=== Google Callback Received ===");
  console.log("Query params:", req.query);

  passport.authenticate('google', {
    session: false,
    state: false,  // Disable state parameter
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin?error=auth_failed`
  }, (err, user, info) => {
    if (err) {
      console.error("CALLBACK AUTH ERROR:", err);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin?error=callback_failed`);
    }
    if (!user) {
      console.error("NO USER RETURNED");
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin?error=no_user`);
    }
    // Pass to controller
    req.user = user;
    googleCallback(req, res, next);
  })(req, res, next);
})

module.exports = router;
