const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateProfile } = require('../validators/profileValidator');

// Configure Multer for PDF Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'uploads/resumes';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        if (!req.user) {
            return cb(new Error('User not authenticated'), null);
        }
        cb(null, `user-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
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
    user.resume = `/uploads/resumes/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Resume uploaded successfully', resumeUrl: user.resume });
}));

module.exports = router;
