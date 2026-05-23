const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ─────────────────────────────────────────────────────────────────
// Student Credential Login
// Route: POST /api/c/:collegeSlug/auth/login
//
// ⚠️ INTERVIEW TIP: Notice the priority of tenant identification:
//   1. req.college (set by tenantResolver from URL slug) — MOST SECURE
//   2. req.body.instituteId — fallback for legacy route (will be removed)
//
// The URL slug is authoritative. The body.instituteId is a legacy fallback
// that will be removed after frontend is fully migrated to /c/:slug routes.
// ─────────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, instituteId } = req.body;

    // Build the query object dynamically
    const query = { email };

    // Business Logic: Determine which college this login belongs to.
    // Priority: URL-based req.college (secure) > body.instituteId (legacy)
    if (req.college) {
      // New tenant-aware route: /api/c/:slug/auth/login
      // The college is guaranteed by tenantResolver — no body trust needed
      query.institute = req.college._id;
    } else if (instituteId) {
      // Legacy route fallback: /auth/login — still uses body for now
      // TODO: Remove this after frontend migration is complete
      query.institute = instituteId;
    }

    // Find user by Email AND Institute (tenant-scoped lookup)
    const user = await User.findOne(query).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials or wrong college portal.' });
    }

    // Validate Password using bcrypt (comparing hashed password)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // Verify Role — Students cannot use this login to gain admin access
    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Please use the Admin Portal.' });
    }

    // Generate JWT Token — includes instituteId for tenant-aware downstream calls
    // ⚠️ INTERVIEW TIP: By embedding instituteId in the JWT, every API call
    // made with this token will automatically know the college context.
    const token = jwt.sign(
      {
        id: user._id,
        instituteId: user.institute,  // College identity baked into token
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key-123',
      { expiresIn: '30d' }
    );

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
        resume: user.resume,
        institute: user.institute,
        collegeSlug: req.college ? req.college.slug : null  // Send slug back to frontend
      },
      token
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/login-failure', (req, res) => {
  res.status(401).json({ message: 'Login Failed' });
});

module.exports = router;

