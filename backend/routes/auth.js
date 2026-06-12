const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateLogin } = require('../validators/authValidator');

// POST /api/c/:collegeSlug/auth/login - Student login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Build tenant-scoped query
    const query = { email };
    if (req.college) {
        query.institute = req.college._id;
    }

    // Find user by Email AND Institute (tenant-scoped lookup)
    const user = await User.findOne(query).select('+password');

    if (!user) {
        throw new AppError('Invalid credentials or wrong college portal.', 401);
    }

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials.', 401);
    }

    // Verify Role — Students only
    if (user.role !== 'student') {
        throw new AppError('Access denied. Please use the Admin Portal.', 403);
    }

    // Generate JWT with instituteId
    const token = jwt.sign(
        {
            id: user._id,
            instituteId: user.institute,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key-123',
        { expiresIn: '30d' }
    );

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
            collegeSlug: req.college ? req.college.slug : null
        },
        token
    });
}));

router.get('/login-failure', (req, res) => {
    res.status(401).json({ message: 'Login Failed' });
});

module.exports = router;
