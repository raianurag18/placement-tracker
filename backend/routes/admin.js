const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Experience = require('../models/Experience');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Admin login route
// ⚠️ INTERVIEW TIP: Notice how we use req.college._id from the URL slug,
// NOT from req.body. This is critical — the tenant identity is determined
// by the URL (/api/c/bitmesra/admin/login), not by user-provided data.
// This prevents a BIT Mesra admin from logging into BITS Goa's portal.
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // --- TENANT-AWARE ADMIN LOGIN ---
        // Build the query based on whether tenantResolver ran
        // (req.college is set when using the new /api/c/:slug/ routes)
        const query = { email, role: 'admin' };

        // Business Logic: If this is a tenant route, also filter by college.
        // This ensures BIT Mesra admin CANNOT login to BITS Goa.
        if (req.college) {
            query.institute = req.college._id;
        }

        // Find admin user by email AND college AND role
        const user = await User.findOne(query).select('+password');

        // Check user exists
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials or wrong college portal.' });
        }

        // Verify password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Generate JWT Token — now includes instituteId for tenant-aware API calls
        // ⚠️ INTERVIEW TIP: Baking instituteId into the JWT means every subsequent
        // API call is automatically college-aware without an extra DB lookup.
        const token = jwt.sign(
            {
                id: user._id,
                instituteId: user.institute, // Bake the college into the token
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

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Pending experiences for admin approval
router.get('/pending-experiences', protect, isAdmin, async (req, res) => {
    try {
        // Business Logic: Only return pending experiences for THIS college
        // req.college is set by tenantResolver middleware
        const collegeFilter = req.college ? { institute: req.college._id } : {};

        const pending = await Experience.find({
            approved: false,
            ...collegeFilter  // Spread the college filter — scopes to current tenant
        }).sort({ _id: -1 });

        res.json(pending);
    } catch (err) {
        console.error('Pending experiences error:', err);
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
