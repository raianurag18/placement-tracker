const Institute = require('../models/Institute');

/**
 * @middleware tenantResolver
 *
 * Purpose: This is the CORE of our multi-tenant SaaS architecture.
 * It runs BEFORE any college-specific route handler.
 *
 * What it does:
 * 1. Reads the collegeSlug from the URL (e.g., 'bitmesra' from /api/c/bitmesra/login)
 * 2. Finds the matching Institute/College in the database
 * 3. Validates that the college is active (not suspended)
 * 4. Attaches req.college — so every downstream route knows which college we're in
 * 5. Rejects invalid or inactive colleges immediately
 *
 * ⚠️ INTERVIEW TIP: This pattern is called "Route-based Multi-tenancy."
 * The tenant identifier (collegeSlug) is embedded in the URL path itself.
 * Other strategies include: subdomain-based (bitmesra.placerra.com) or
 * header-based (X-College-Slug: bitmesra). We use URL-based because it's
 * simpler, stateless, and doesn't require subdomain DNS setup.
 */
const tenantResolver = async (req, res, next) => {
    try {
        // Step 1: Get the slug from the URL parameters
        // This works because the route is mounted as: /api/c/:collegeSlug/...
        const slug = req.params.collegeSlug;

        if (!slug) {
            return res.status(400).json({
                message: 'College identifier (slug) is missing from the URL.'
            });
        }

        // Step 2: Find the college in the database using the slug
        // We also check isActive to prevent access to suspended colleges
        const college = await Institute.findOne({
            slug: slug.toLowerCase(),
            isActive: true
        });

        // Step 3: If not found, immediately reject the request
        if (!college) {
            return res.status(404).json({
                message: `College with slug '${slug}' not found or is inactive.`
            });
        }

        // Step 4: Attach the college to the request object
        // Now every route handler that comes AFTER this middleware
        // can safely access req.college to filter data by this college.
        req.college = college;

        // Step 5: Continue to the next middleware/route handler
        next();

    } catch (err) {
        console.error('❌ Tenant resolver error:', err.message);
        res.status(500).json({ message: 'Server error while resolving college.' });
    }
};

module.exports = tenantResolver;
