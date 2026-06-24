const router = require('express').Router();
const Institute = require('../models/Institute');
const Placement = require('../models/Placement');
const Experience = require('../models/Experience');
const Job = require('../models/Job');
const tenantResolver = require('../middleware/tenantResolver');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/institutes/search?q=BIT - Search institutes (Landing Page)
router.get('/search', asyncHandler(async (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);

    const institutes = await Institute.find({
        name: { $regex: new RegExp(q, 'i') },
        isActive: true
    })
    .select('name city logoUrl slug')
    .limit(10);

    res.json(institutes);
}));

// GET /api/institutes/:collegeSlug/meta - Get college metadata (public)
router.get('/:collegeSlug/meta', tenantResolver, asyncHandler(async (req, res) => {
    res.json({
        name: req.college.name,
        city: req.college.city,
        logoUrl: req.college.logoUrl,
        slug: req.college.slug
    });
}));

// GET /api/institutes/:collegeSlug/public-stats - Public overview stats (pre-login portal)
router.get('/:collegeSlug/public-stats', tenantResolver, asyncHandler(async (req, res) => {
    const instId = req.college._id;

    const [totalPlacements, totalCompanies, totalExperiences, activeJobs] = await Promise.all([
        Placement.countDocuments({ institute: instId }),
        Placement.distinct('companyName', { institute: instId }).then(arr => arr.length),
        Experience.countDocuments({ institute: instId, approved: true }),
        Job.countDocuments({ institute: instId, deadline: { $gte: new Date() } })
    ]);

    res.json({ totalPlacements, totalCompanies, totalExperiences, activeJobs });
}));

module.exports = router;
