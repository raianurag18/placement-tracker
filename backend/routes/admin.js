const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Experience = require('../models/Experience');
const Application = require('../models/Application');
const Job = require('../models/Job');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { asyncHandler, AppError } = require('../middleware/errorHandler');
const { validateLogin } = require('../validators/authValidator');

// POST /api/c/:collegeSlug/admin/login - Admin login
router.post('/login', validateLogin, asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Tenant-aware admin login: filter by email + role + college
    const query = { email, role: 'admin' };
    if (req.college) {
        query.institute = req.college._id;
    }

    const user = await User.findOne(query).select('+password');

    if (!user) {
        throw new AppError('Invalid credentials or wrong college portal.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials.', 401);
    }

    // Generate JWT with instituteId baked in
    const token = jwt.sign(
        {
            id: user._id,
            instituteId: user.institute,
            role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key-123',
        { expiresIn: '1d' }
    );

    res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: {
            email: user.email,
            role: user.role,
            institute: user.institute,
            collegeSlug: req.college ? req.college.slug : null
        }
    });
}));

// GET /api/c/:collegeSlug/admin/pending-experiences
router.get('/pending-experiences', protect, isAdmin, asyncHandler(async (req, res) => {
    const pending = await Experience.find({
        approved: false,
        institute: req.college._id
    }).sort({ _id: -1 });

    res.json(pending);
}));

// PATCH /api/c/:collegeSlug/admin/approve/:id
router.patch('/approve/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    // Scope by institute so an admin cannot approve another college's experience
    const updated = await Experience.findOneAndUpdate(
        { _id: req.params.id, institute: req.college._id },
        { approved: true },
        { new: true }
    );
    if (!updated) {
        throw new AppError('Experience not found', 404);
    }
    res.json(updated);
}));

// DELETE /api/c/:collegeSlug/admin/experience/:id
router.delete('/experience/:id', protect, isAdmin, asyncHandler(async (req, res) => {
    // Scope by institute so an admin cannot delete another college's experience
    const experience = await Experience.findOneAndDelete({
        _id: req.params.id,
        institute: req.college._id
    });
    if (!experience) {
        throw new AppError('Experience not found', 404);
    }
    res.json({ message: 'Experience deleted' });
}));

// GET /api/c/:collegeSlug/admin/applications - Get all applications for this college's jobs
router.get('/applications', protect, isAdmin, asyncHandler(async (req, res) => {
    // Get all jobs for this college
    const jobs = await Job.find({ institute: req.college._id }).sort({ createdAt: -1 });

    // Get all applications for these jobs, populated with student info
    const jobIds = jobs.map(j => j._id);
    const applications = await Application.find({ job: { $in: jobIds } })
        .populate('student', 'name email branch cgpa')
        .populate('job', 'company role')
        .sort({ appliedAt: -1 });

    // Group applications by job
    const grouped = jobs.map(job => ({
        _id: job._id,
        company: job.company,
        role: job.role,
        deadline: job.deadline,
        applicants: applications
            .filter(app => app.job && app.job._id.toString() === job._id.toString())
            .map(app => ({
                _id: app._id,
                studentName: app.student?.name || 'Unknown',
                studentEmail: app.student?.email || '',
                branch: app.student?.branch || '',
                cgpa: app.student?.cgpa || 0,
                status: app.status,
                appliedAt: app.appliedAt
            }))
    }));

    res.json(grouped);
}));

// PATCH /api/c/:collegeSlug/admin/applications/:id/status - Update application status
router.patch('/applications/:id/status', protect, isAdmin, asyncHandler(async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
        throw new AppError('Invalid status value', 400);
    }

    // Scope by institute so an admin cannot change another college's application status
    const application = await Application.findOneAndUpdate(
        { _id: req.params.id, institute: req.college._id },
        { status },
        { new: true }
    );

    if (!application) {
        throw new AppError('Application not found', 404);
    }

    res.json(application);
}));

module.exports = router;
