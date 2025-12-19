const express = require('express')
const router = express.Router()
const { signUp, signIn, signOut, guestSignIn } = require('../controllers/auth')

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.post('/guest', guestSignIn)

module.exports = router;
