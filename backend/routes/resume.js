const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/c/:collegeSlug/resume/my - Get current user's resume
router.get('/my', protect, asyncHandler(async (req, res) => {
    const resume = await Resume.findOne({ student: req.user._id });
    res.json(resume); // Returns null if no resume exists
}));

// POST /api/c/:collegeSlug/resume/update - Create or Update Resume (Upsert)
router.post('/update', protect, asyncHandler(async (req, res) => {
    const { personalInfo, education, experience, projects, skills, achievements } = req.body;

    const resume = await Resume.findOneAndUpdate(
        { student: req.user._id },
        {
            $set: {
                personalInfo,
                education,
                experience,
                projects,
                skills,
                achievements,
                updatedAt: Date.now()
            }
        },
        { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true }
    );

    res.json(resume);
}));

module.exports = router;
