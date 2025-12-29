const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/jobs - Get all active jobs for the user's institute
router.get('/', protect, async (req, res) => {
    try {
        // Filter by Institute
        const jobs = await Job.find({ institute: req.user.institute })
            .sort({ createdAt: -1 }); // Newest first
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/jobs - Create a new job (Admin only)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { company, role, ctc, description, eligibility, deadline, logo, applyLink } = req.body;

        const newJob = new Job({
            company,
            role,
            ctc,
            description,
            eligibility,
            deadline,
            logo,
            applyLink,
            institute: req.user.institute, // Auto-assign to Admin's institute
            postedBy: req.user._id
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create job' });
    }
});

// DELETE /api/jobs/:id - Delete a job (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Ensure Admin belongs to same institute
        if (job.institute.toString() !== req.user.institute.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
