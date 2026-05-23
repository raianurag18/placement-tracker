const router = require('express').Router();
const Institute = require('../models/Institute');
const tenantResolver = require('../middleware/tenantResolver');

// ─────────────────────────────────────────────────────────────────
// PUBLIC: Search institutes by name (for the Landing Page search bar)
// Route: GET /api/institutes/search?q=BIT
//
// Purpose: When user types "BIT" in the landing page search bar,
// this returns matching active colleges with their slugs.
// The slug is used by frontend to navigate to /c/:slug
// ─────────────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        const institutes = await Institute.find({
            name: { $regex: new RegExp(q, 'i') }, // Case-insensitive fuzzy search
            isActive: true // Only show active colleges
        })
        .select('name city logoUrl slug') // Include slug for frontend navigation
        .limit(10);

        res.json(institutes);
    } catch (err) {
        console.error('Institute search error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ─────────────────────────────────────────────────────────────────
// PUBLIC: Get college metadata (for tenant pages)
// Route: GET /api/c/:collegeSlug/meta
//
// Purpose: When frontend loads /c/bitmesra, it calls this to get
// the college's name, logo, and location for display in the header.
//
// ⚠️ INTERVIEW TIP: This is a public endpoint (no auth needed) because
// the college branding is visible to everyone — even unauthenticated users.
// ─────────────────────────────────────────────────────────────────
router.get('/:collegeSlug/meta', tenantResolver, async (req, res) => {
    try {
        // req.college is already populated by tenantResolver
        res.json({
            name: req.college.name,
            city: req.college.city,
            logoUrl: req.college.logoUrl,
            slug: req.college.slug
        });
    } catch (err) {
        console.error('College meta error:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

