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
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  }, (err, user, info) => {
    if (err) {
      console.error("Google OAuth Error:", err);
      return res.status(500).json({ error: 'OAuth authentication failed', details: err.message });
    }
    next();
  })(req, res, next);
})

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signin?error=auth_failed`
  }),
  googleCallback
)

module.exports = router;
