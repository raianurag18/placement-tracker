const express = require('express');
// const passport = require('passport'); // Removed
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Credential Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, instituteId } = req.body;

    // 1. Find user by Email AND Institute
    const user = await User.findOne({
      email,
      institute: instituteId
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or wrong institute.' });
    }

    // 2. Validate Password (Using bcrypt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // 3. Create Session
    // 3. Generate Token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key-123', {
      expiresIn: '30d',
    });

    // Return User & Token
    res.json({
      message: 'Logged in successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        cgpa: user.cgpa,
        phone: user.phone,
        resume: user.resume
      },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/login-failure', (req, res) => {
  res.status(401).json({ message: 'Login Failed' });
});

module.exports = router;
