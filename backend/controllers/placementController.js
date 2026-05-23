const Placement = require('../models/Placement');

/**
 * Helper: Build college filter for queries.
 *
 * Business Logic: If tenantResolver ran (req.college is set),
 * we filter all data by this college. If called from a legacy
 * global route (req.college is undefined), no filter is applied.
 *
 * ⚠️ INTERVIEW TIP: This is the KEY pattern for multi-tenant data isolation.
 * Every single database query uses this filter to ensure college A cannot
 * see college B's data. It's the database-level enforcement of tenancy.
 */
const getCollegeFilter = (req) => {
    // If tenantResolver ran, it set req.college — use it for isolation
    if (req.college) {
        return { institute: req.college._id };
    }
    // Legacy route — no filter (backward compatible, remove after full migration)
    return {};
};

// ─────────────────────────────────────────────────────────────────
// Get overview stats (total companies, offers, highest & avg package)
// ─────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
    try {
        // Get the college-specific filter for this request
        const collegeFilter = getCollegeFilter(req);

        const distinctCompanies = await Placement.distinct('companyName', collegeFilter);
        const totalCompanies = distinctCompanies.length;
        const totalOffers = await Placement.countDocuments(collegeFilter);
        const highestPackage = await Placement.findOne(collegeFilter).sort({ package: -1 });

        // ⚠️ INTERVIEW TIP: MongoDB Aggregation Pipeline.
        // $match filters docs, $group calculates averages.
        // The { $match: collegeFilter } ensures only this college's data is used.
        const averagePackage = await Placement.aggregate([
            { $match: collegeFilter },
            { $group: { _id: null, avgPackage: { $avg: '$package' } } },
        ]);

        res.json({
            totalCompanies,
            totalOffers,
            highestPackage: highestPackage ? highestPackage.package : 0,
            averagePackage: averagePackage.length ? averagePackage[0].avgPackage : 0,
        });
    } catch (error) {
        console.error('getStats error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Get list of all unique companies that visited this college
// ─────────────────────────────────────────────────────────────────
exports.getCompanies = async (req, res) => {
    try {
        const collegeFilter = getCollegeFilter(req);
        // distinct() returns unique company names filtered by this college
        const companies = await Placement.distinct('companyName', collegeFilter);
        res.json(companies);
    } catch (error) {
        console.error('getCompanies error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Get placements for a specific company (within this college)
// ─────────────────────────────────────────────────────────────────
exports.getPlacementsByCompany = async (req, res) => {
    try {
        const collegeFilter = getCollegeFilter(req);
        // Business Logic: Find all placements for company X, ONLY for this college
        const placements = await Placement.find({
            companyName: req.params.companyName,
            ...collegeFilter  // Spread to add institute filter
        });
        res.json(placements);
    } catch (error) {
        console.error('getPlacementsByCompany error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Get stats grouped by branch (for this college only)
// ─────────────────────────────────────────────────────────────────
exports.getBranchStats = async (req, res) => {
    try {
        const collegeFilter = getCollegeFilter(req);

        // ⚠️ INTERVIEW TIP: Aggregation pipeline with $match + $group.
        // $match: First filter to this college's placements only
        // $group: Then group by branch and compute avg package per branch
        const branchStats = await Placement.aggregate([
            { $match: collegeFilter },
            {
                $group: {
                    _id: '$branch',
                    avgPackage: { $avg: '$package' },
                },
            },
        ]);
        res.json(branchStats);
    } catch (error) {
        console.error('getBranchStats error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Get placements for a specific branch (within this college)
// ─────────────────────────────────────────────────────────────────
exports.getPlacementsByBranch = async (req, res) => {
    try {
        const collegeFilter = getCollegeFilter(req);
        const placements = await Placement.find({
            branch: req.params.branchName,
            ...collegeFilter
        }).sort({ package: -1 });
        res.json(placements);
    } catch (error) {
        console.error('getPlacementsByBranch error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Get highest package by branch (within this college)
// ─────────────────────────────────────────────────────────────────
exports.getHighestPackageByBranch = async (req, res) => {
    try {
        const collegeFilter = getCollegeFilter(req);

        const branchStats = await Placement.aggregate([
            { $match: collegeFilter },
            {
                $group: {
                    _id: '$branch',
                    maxPackage: { $max: '$package' },
                },
            },
        ]);
        res.json(branchStats);
    } catch (error) {
        console.error('getHighestPackageByBranch error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Get all placements (for this college, sorted by package)
// ─────────────────────────────────────────────────────────────────
exports.getAllPlacements = async (req, res) => {
    try {
        const collegeFilter = getCollegeFilter(req);
        const placements = await Placement.find(collegeFilter).sort({ package: -1 });
        res.json(placements);
    } catch (error) {
        console.error('getAllPlacements error:', error);
        res.status(500).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Create a new placement record (Admin only, auto-attached to college)
// ─────────────────────────────────────────────────────────────────
exports.createPlacement = async (req, res) => {
    try {
        const placement = new Placement({
            ...req.body,
            // Business Logic: Auto-attach this placement to the current college.
            // Admin cannot manually specify a different college — it comes from the URL.
            ...(req.college && { institute: req.college._id })
        });

        const newPlacement = await placement.save();
        res.status(201).json(newPlacement);
    } catch (error) {
        console.error('createPlacement error:', error);
        res.status(400).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Update placement (Admin only)
// ─────────────────────────────────────────────────────────────────
exports.updatePlacement = async (req, res) => {
    try {
        const updatedPlacement = await Placement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPlacement);
    } catch (error) {
        console.error('updatePlacement error:', error);
        res.status(400).json({ message: error.message });
    }
};

// ─────────────────────────────────────────────────────────────────
// Delete placement (Admin only)
// ─────────────────────────────────────────────────────────────────
exports.deletePlacement = async (req, res) => {
    try {
        await Placement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Placement record deleted' });
    } catch (error) {
        console.error('deletePlacement error:', error);
        res.status(500).json({ message: error.message });
    }
};
