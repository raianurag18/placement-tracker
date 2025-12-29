const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
    // filename: user-<id>-<timestamp>.pdf
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
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware to ensure user is authenticated logic replaced by protect
const { protect } = require('../middleware/authMiddleware');

// GET / - Get current profile
router.get('/', protect, (req, res) => {
  res.json(req.user);
});

// PUT / - Update profile (Phone only)
router.put('/', protect, async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findById(req.user._id);

    // Update Phone (with validation)
    if (phone) {
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
      }
      user.phone = phone;
    }

    // Branch and CGPA are NOT updated here (Admin controlled)
    
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /resume - Upload resume
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  // ensureAuth guarantees req.user exists, so upload.single won't crash

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    // Path accessible via server, e.g., /uploads/resumes/filename.pdf
    user.resume = `/uploads/resumes/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Resume uploaded successfully', resumeUrl: user.resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
