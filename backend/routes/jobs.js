const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateJob } = require('../validators/jobValidator');

// GET /api/c/:collegeSlug/jobs - Get all active jobs for this college
router.get('/', protect, asyncHandler(async (req, res) => {
    const jobs = await Job.find({ institute: req.college._id })
        .sort({ createdAt: -1 });
    res.json(jobs);
}));

// POST /api/c/:collegeSlug/jobs - Create a new job (Admin only)
router.post('/', protect, isAdmin, validateJob, asyncHandler(async (req, res) => {
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
        institute: req.college._id,
        postedBy: req.user._id
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
}));

// PUT /api/c/:collegeSlug/jobs/:id - Update a job (Admin only)
router.put('/:id', protect, isAdmin, validateJob, asyncHandler(async (req, res) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        throw new AppError('Job not found', 404);
    }

    // Ensure Admin belongs to same institute
    if (job.institute.toString() !== req.user.institute.toString()) {
        throw new AppError('Not authorized', 403);
    }

    const { company, role, ctc, description, eligibility, deadline, logo, applyLink } = req.body;

    job.company = company || job.company;
    job.role = role || job.role;
    job.ctc = ctc || job.ctc;
    job.description = description || job.description;
    job.eligibility = eligibility || job.eligibility;
    job.deadline = deadline || job.deadline;
    job.logo = logo || job.logo;
    job.applyLink = applyLink || job.applyLink;

    const updatedJob = await job.save();
    res.json(updatedJob);
}));

// DELETE /api/c/:collegeSlug/jobs/:id - Delete a job (Admin only)
router.delete('/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        throw new AppError('Job not found', 404);
    }

    if (job.institute.toString() !== req.user.institute.toString()) {
        throw new AppError('Not authorized', 403);
    }

    await job.deleteOne();
    res.json({ message: 'Job removed' });
}));

module.exports = router;
