const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateExperience } = require('../validators/experienceValidator');

// GET /api/c/:collegeSlug/experiences - Get all approved experiences
router.get('/', protect, asyncHandler(async (req, res) => {
    const experiences = await Experience.find({
        approved: true,
        institute: req.college._id
    }).sort({ _id: -1 });

    res.json(experiences);
}));

// GET /api/c/:collegeSlug/experiences/:id - Get specific experience
router.get('/:id', protect, asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
        throw new AppError('Experience not found', 404);
    }
    res.json(experience);
}));

// POST /api/c/:collegeSlug/experiences - Submit new experience (student)
router.post('/', protect, validateExperience, asyncHandler(async (req, res) => {
    const newExperience = new Experience({
        ...req.body,
        approved: false, // Always starts as unapproved — admin must review
        institute: req.college._id
    });
    await newExperience.save();
    res.status(201).json({ message: 'Experience submitted successfully!' });
}));

// DELETE /api/c/:collegeSlug/experiences/:id - Delete (Admin only)
router.delete('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
        throw new AppError('Experience not found', 404);
    }
    res.json({ message: 'Experience deleted successfully' });
}));

module.exports = router;
