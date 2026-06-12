const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateCreateApplication, validateUpdateApplication } = require('../validators/applicationValidator');

// POST /api/c/:collegeSlug/applications/apply/:jobId - Apply for a job
router.post('/apply/:jobId', protect, asyncHandler(async (req, res) => {
    const jobId = req.params.jobId;
    const studentId = req.user._id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
        throw new AppError('Job not found', 404);
    }

    // Ensure the job belongs to this college
    if (job.institute.toString() !== req.college._id.toString()) {
        throw new AppError('Not authorized: This job belongs to a different college.', 403);
    }

    // Check if student already applied
    const existingApplication = await Application.findOne({ job: jobId, student: studentId });
    if (existingApplication) {
        throw new AppError('You have already applied for this job', 400);
    }

    // Create Application
    const application = new Application({
        job: jobId,
        student: studentId,
        institute: req.college._id,
        company: job.company,
        role: job.role
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
}));

// GET /api/c/:collegeSlug/applications/my - Get current user's applications
router.get('/my', protect, asyncHandler(async (req, res) => {
    const applications = await Application.find({ student: req.user._id })
        .populate('job', 'company role status logo')
        .sort({ appliedAt: -1 });

    res.json(applications);
}));

// GET /api/c/:collegeSlug/applications/check/:jobId - Check if user applied
router.get('/check/:jobId', protect, asyncHandler(async (req, res) => {
    const existingApplication = await Application.findOne({
        job: req.params.jobId,
        student: req.user._id
    });
    res.json({ hasApplied: !!existingApplication });
}));

// PATCH /api/c/:collegeSlug/applications/:id - Update status or notes
router.patch('/:id', protect, validateUpdateApplication, asyncHandler(async (req, res) => {
    const { status, notes, company, role } = req.body;

    const application = await Application.findOneAndUpdate(
        { _id: req.params.id, student: req.user._id },
        {
            $set: {
                ...(company && { company }),
                ...(role && { role }),
                ...(status && { status }),
                ...(notes !== undefined && { notes })
            }
        },
        { new: true, runValidators: false }
    );

    if (!application) {
        throw new AppError('Application not found', 404);
    }

    res.json(application);
}));

// POST /api/c/:collegeSlug/applications/create - Manual application entry
router.post('/create', protect, validateCreateApplication, asyncHandler(async (req, res) => {
    const { company, role, status, notes, appliedAt } = req.body;

    const application = new Application({
        student: req.user._id,
        company,
        role,
        status: status || 'Applied',
        notes,
        appliedAt: appliedAt || Date.now()
    });

    await application.save();
    res.status(201).json(application);
}));

// DELETE /api/c/:collegeSlug/applications/:id - Delete an application
router.delete('/:id', protect, asyncHandler(async (req, res) => {
    const application = await Application.findOneAndDelete({
        _id: req.params.id,
        student: req.user._id
    });

    if (!application) {
        throw new AppError('Application not found', 404);
    }

    res.json({ message: 'Application deleted' });
}));

module.exports = router;
