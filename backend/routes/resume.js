const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { protect } = require('../middleware/authMiddleware');

// GET /api/resume/my - Get current user's resume
router.get('/my', protect, async (req, res) => {
    try {
        let resume = await Resume.findOne({ student: req.user._id });

        // If no resume exists, return null (frontend handles empty state)
        // or return a structured empty object if preferred.
        if (!resume) {
            return res.json(null);
        }

        res.json(resume);
    } catch (err) {
        console.error("Fetch Resume Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/resume/update - Create or Update Resume
router.post('/update', protect, async (req, res) => {
    try {
        const {
            personalInfo,
            education,
            experience,
            projects,
            skills,
            achievements
        } = req.body;

        // Find and Update (Upsert)
        // new: true -> returns updated doc
        // upsert: true -> creates if not found
        // setDefaultsOnInsert: true -> ensures defaults are set on creation
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
    } catch (err) {
        console.error("Update Resume Error:", err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
