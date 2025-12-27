const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { signUp, signIn, signOut, guestSignIn, googleCallback } = require('../controllers/auth')

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.post('/guest', guestSignIn)

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
)

router.get('/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173/signin?error=auth_failed'
  }),
  googleCallback
)

module.exports = router;
