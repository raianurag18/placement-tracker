const Placement = require('../models/Placement');
const { AppError } = require('../middleware/errorHandler');

// ─────────────────────────────────────────────────────────────────
// Get overview stats (total companies, offers, highest & avg package)
// ─────────────────────────────────────────────────────────────────
exports.getStats = async (req, res) => {
    const collegeFilter = { institute: req.college._id };

    const distinctCompanies = await Placement.distinct('companyName', collegeFilter);
    const totalCompanies = distinctCompanies.length;
    const totalOffers = await Placement.countDocuments(collegeFilter);
    const highestPackage = await Placement.findOne(collegeFilter).sort({ package: -1 });

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
};

// ─────────────────────────────────────────────────────────────────
// Get list of all unique companies that visited this college
// ─────────────────────────────────────────────────────────────────
exports.getCompanies = async (req, res) => {
    const companies = await Placement.distinct('companyName', { institute: req.college._id });
    res.json(companies);
};

// ─────────────────────────────────────────────────────────────────
// Get placements for a specific company (within this college)
// ─────────────────────────────────────────────────────────────────
exports.getPlacementsByCompany = async (req, res) => {
    const placements = await Placement.find({
        companyName: req.params.companyName,
        institute: req.college._id
    });
    res.json(placements);
};

// ─────────────────────────────────────────────────────────────────
// Get stats grouped by branch (for this college only)
// ─────────────────────────────────────────────────────────────────
exports.getBranchStats = async (req, res) => {
    const branchStats = await Placement.aggregate([
        { $match: { institute: req.college._id } },
        { $group: { _id: '$branch', avgPackage: { $avg: '$package' } } },
    ]);
    res.json(branchStats);
};

// ─────────────────────────────────────────────────────────────────
// Get placements for a specific branch (within this college)
// ─────────────────────────────────────────────────────────────────
exports.getPlacementsByBranch = async (req, res) => {
    const placements = await Placement.find({
        branch: req.params.branchName,
        institute: req.college._id
    }).sort({ package: -1 });
    res.json(placements);
};

// ─────────────────────────────────────────────────────────────────
// Get highest package by branch (within this college)
// ─────────────────────────────────────────────────────────────────
exports.getHighestPackageByBranch = async (req, res) => {
    const branchStats = await Placement.aggregate([
        { $match: { institute: req.college._id } },
        { $group: { _id: '$branch', maxPackage: { $max: '$package' } } },
    ]);
    res.json(branchStats);
};

// ─────────────────────────────────────────────────────────────────
// Get all placements (for this college, sorted by package)
// ─────────────────────────────────────────────────────────────────
exports.getAllPlacements = async (req, res) => {
    const placements = await Placement.find({ institute: req.college._id })
        .sort({ package: -1 });
    res.json(placements);
};

// ─────────────────────────────────────────────────────────────────
// Create a new placement record (Admin only)
// ─────────────────────────────────────────────────────────────────
exports.createPlacement = async (req, res) => {
    const placement = new Placement({
        ...req.body,
        institute: req.college._id
    });

    const newPlacement = await placement.save();
    res.status(201).json(newPlacement);
};

// ─────────────────────────────────────────────────────────────────
// Update placement (Admin only)
// ─────────────────────────────────────────────────────────────────
exports.updatePlacement = async (req, res) => {
    const updatedPlacement = await Placement.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updatedPlacement) {
        throw new AppError('Placement not found', 404);
    }
    res.json(updatedPlacement);
};

// ─────────────────────────────────────────────────────────────────
// Delete placement (Admin only)
// ─────────────────────────────────────────────────────────────────
exports.deletePlacement = async (req, res) => {
    const placement = await Placement.findByIdAndDelete(req.params.id);
    if (!placement) {
        throw new AppError('Placement not found', 404);
    }
    res.json({ message: 'Placement record deleted' });
};
