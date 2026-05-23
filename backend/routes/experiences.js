const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const isAdmin = require('../middleware/isAdmin');

/**
 * Helper: Returns college filter object for DB queries.
 * Uses req.college set by tenantResolver on new /api/c/:slug/ routes.
 * Returns {} for legacy routes (backward compatible).
 */
const getCollegeFilter = (req) => {
    return req.college ? { institute: req.college._id } : {};
};

// GET all approved experiences (for this college only)
router.get('/', async (req, res) => {
  try {
    const collegeFilter = getCollegeFilter(req);

    // Business Logic: Return approved experiences for this specific college.
    // Without the college filter, students from BIT Mesra would see BITS Goa experiences.
    const experiences = await Experience.find({
        approved: true,
        ...collegeFilter
    }).sort({ _id: -1 }); // newest first

    res.json(experiences);
  } catch (err) {
    console.error('Get experiences error:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET specific experience by ID
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: 'Experience not found' });
    }
    res.json(experience);
  } catch (err) {
    console.error('Get experience by ID error:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST a new experience (submitted by a student)
router.post('/', async (req, res) => {
  try {
    const newExperience = new Experience({
        ...req.body,
        approved: false, // Always starts as unapproved — admin must review
        // Business Logic: Auto-attach experience to this college.
        // Student cannot submit to a different college's experience board.
        ...(req.college && { institute: req.college._id })
    });
    await newExperience.save();
    res.status(201).json({ message: 'Experience submitted successfully!' });
  } catch (error) {
    console.error('Submit experience error:', error);
    res.status(500).json({ message: 'Failed to submit experience' });
  }
});

// DELETE experience by ID (Admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await Experience.findByIdAndDelete(id);
    res.json({ message: 'Experience deleted successfully' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

