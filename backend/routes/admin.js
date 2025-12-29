const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Experience = require('../models/Experience');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Admin login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email and explicitly select password
        const user = await User.findOne({ email }).select('+password');

        // Check user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Verify password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied: Not an administrator' });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key-123', {
            expiresIn: '1d',
        });

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            user: { email: user.email, role: 'admin' }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

//Pending request for admin
router.get('/pending-experiences', protect, isAdmin, async (req, res) => {
    try {
        const pending = await Experience.find({ approved: false }).sort({ _id: -1 });
        res.json(pending);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Allow admin to approve
router.patch('/approve/:id', protect, isAdmin, async (req, res) => {
    try {
        const updated = await Experience.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: 'Approval failed' });
    }
});

//Allow admin to delete experience
router.delete('/experience/:id', protect, isAdmin, async (req, res) => {
    try {
        await Experience.findByIdAndDelete(req.params.id);
        res.json({ message: 'Experience deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Delete failed' });
    }
});

module.exports = router;
