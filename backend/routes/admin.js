const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Experience = require('../models/Experience');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateLogin } = require('../validators/authValidator');

// POST /api/c/:collegeSlug/admin/login - Admin login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Tenant-aware admin login: filter by email + role + college
    const query = { email, role: 'admin' };
    if (req.college) {
        query.institute = req.college._id;
    }

    const user = await User.findOne(query).select('+password');

    if (!user) {
        throw new AppError('Invalid credentials or wrong college portal.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials.', 401);
    }

    // Generate JWT with instituteId baked in
    const token = jwt.sign(
        {
            id: user._id,
            instituteId: user.institute,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key-123',
        { expiresIn: '1d' }
    );

    res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
            email: user.email,
            role: user.role,
            institute: user.institute,
            collegeSlug: req.college ? req.college.slug : null
        }
    });
}));

// GET /api/c/:collegeSlug/admin/pending-experiences
router.get('/pending-experiences', protect, isAdmin, asyncHandler(async (req, res) => {
    const pending = await Experience.find({
        approved: false,
        institute: req.college._id
    }).sort({ _id: -1 });

    res.json(pending);
}));

// PATCH /api/c/:collegeSlug/admin/approve/:id
router.patch('/approve/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    const updated = await Experience.findByIdAndUpdate(
        req.params.id,
        { approved: true },
        { new: true }
    );
    if (!updated) {
        throw new AppError('Experience not found', 404);
    }
    res.json(updated);
}));

// DELETE /api/c/:collegeSlug/admin/experience/:id
router.delete('/experience/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
        throw new AppError('Experience not found', 404);
    }
    res.json({ message: 'Experience deleted' });
}));

module.exports = router;
