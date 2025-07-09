// backend/routes/auth.js
const express = require('express');
const passport = require('passport');

const router = express.Router();

// Google OAuth login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',  // Redirect after successful login
    failureRedirect: 'http://localhost:3000/login-failed'
  })
);

module.exports = router;
