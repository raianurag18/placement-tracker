const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Job = require('../models/Job');
const { protect } = require('../middleware/authMiddleware');

// POST /api/applications/apply/:jobId - Apply for a job
router.post('/apply/:jobId', protect, async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const studentId = req.user._id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user belongs to same institute
        if (job.institute.toString() !== req.user.institute.toString()) {
            return res.status(401).json({ message: 'Not authorized for this job' });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({ job: jobId, student: studentId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // Create Application
        const application = new Application({
            job: jobId,
            student: studentId,
            institute: req.user.institute,
            company: job.company, // Auto-fill from Job
            role: job.role        // Auto-fill from Job
        });

        await application.save();
        res.status(201).json({ message: 'Application submitted successfully', application });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/applications/my - Get current user's applications
router.get('/my', protect, async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate('job', 'company role status logo') // Populate job details
            .sort({ appliedAt: -1 });

        res.json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/applications/check/:jobId - Check if user applied to specific job (For UI button state)
router.get('/check/:jobId', protect, async (req, res) => {
    try {
        const existingApplication = await Application.findOne({ job: req.params.jobId, student: req.user._id });
        res.json({ hasApplied: !!existingApplication });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PATCH /api/applications/:id - Update status or notes
router.patch('/:id', protect, async (req, res) => {
    try {
        const { status, notes, company, role } = req.body;

        // Use findOneAndUpdate to avoid full document validation failure on legacy data
        // (Legacy docs might miss 'company'/'role' which are now required)
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
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json(application);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/applications/create - Manual application entry
router.post('/create', protect, async (req, res) => {
    try {
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
    } catch (err) {
        console.error("Create Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE /api/applications/:id - Delete an application
router.delete('/:id', protect, async (req, res) => {
    try {
        const application = await Application.findOneAndDelete({ _id: req.params.id, student: req.user._id });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        res.json({ message: 'Application deleted' });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
