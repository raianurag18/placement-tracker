const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');

// GET all approved experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find({ approved: true }).sort({ _id: -1 }); // newest first
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new experience
router.post('/', async (req, res) => {
  try {
    const newExperience = new Experience({ ...req.body, approved: false });
    await newExperience.save();
    res.status(201).json({ message: 'Experience submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to submit experience' });
  }
});

const isAdmin = require('../middleware/isAdmin');

// DELETE experience by ID
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
