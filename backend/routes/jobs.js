const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET /api/c/:collegeSlug/jobs - Get all active jobs for this college
router.get('/', protect, async (req, res) => {
    try {
        // Business Logic: Use req.college (from tenantResolver) for isolation.
        // Fallback to req.user.institute for the legacy route.
        const collegeId = req.college ? req.college._id : req.user.institute;

        const jobs = await Job.find({ institute: collegeId })
            .sort({ createdAt: -1 }); // Newest first
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/c/:collegeSlug/jobs - Create a new job (Admin only)
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
            // Business Logic: Auto-assign to req.college (URL-based) for security.
            // Admin cannot post a job to a different college by sending a fake instituteId.
            institute: req.college ? req.college._id : req.user.institute,
            postedBy: req.user._id
        });

        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create job' });
    }
});

// PUT /api/jobs/:id - Update a job (Admin only)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Ensure Admin belongs to same institute
        if (job.institute.toString() !== req.user.institute.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Update fields
        const { company, role, ctc, description, eligibility, deadline, logo, applyLink } = req.body;

        job.company = company || job.company;
        job.role = role || job.role;
        job.ctc = ctc || job.ctc;
        job.description = description || job.description;
        job.eligibility = eligibility || job.eligibility;
        job.deadline = deadline || job.deadline; // Assuming date string is passed
        job.logo = logo || job.logo;
        job.applyLink = applyLink || job.applyLink;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update job' });
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
