const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateProfile } = require('../validators/profileValidator');

// Configure Multer for secure, tenant-isolated PDF uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!req.user) {
            return cb(new Error('User not authenticated'), null);
        }
        // Group uploads by Institute ID for tenant-level isolation
        const dir = `uploads/${req.user.institute}/resumes`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Generate a random, cryptographically secure 32-character filename
        const randomName = crypto.randomBytes(16).toString('hex');
        cb(null, `${randomName}.pdf`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new AppError('Only PDF files are allowed!', 400), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// GET /api/c/:collegeSlug/profile - Get current profile
router.get('/', protect, asyncHandler(async (req, res) => {
    res.json(req.user);
}));

// PUT /api/c/:collegeSlug/profile - Update profile
router.put('/', protect, validateProfile, asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const user = await User.findById(req.user._id);

    if (phone) {
        user.phone = phone;
    }

    await user.save();
    res.json({ message: 'Profile updated', user });
}));

// POST /api/c/:collegeSlug/profile/resume - Upload resume PDF
router.post('/resume', protect, upload.single('resume'), asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new AppError('No file uploaded', 400);
    }

    const user = await User.findById(req.user._id);
    // Sanitize path separators so they remain web-safe forward slashes on both Windows and Linux
    user.resume = `/${req.file.path.replace(/\\/g, '/')}`;
    await user.save();

    res.json({ message: 'Resume uploaded successfully', resumeUrl: user.resume });
}));

module.exports = router;
