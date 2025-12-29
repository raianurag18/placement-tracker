const Placement = require('../models/Placement');

// Get overview stats
exports.getStats = async (req, res) => {
    try {
        const distinctCompanies = await Placement.distinct('companyName');
        const totalCompanies = distinctCompanies.length;
        const totalOffers = await Placement.countDocuments();
        const highestPackage = await Placement.findOne().sort({ package: -1 });
        const averagePackage = await Placement.aggregate([
            { $group: { _id: null, avgPackage: { $avg: '$package' } } },
        ]);

        res.json({
            totalCompanies,
            totalOffers,
            highestPackage: highestPackage ? highestPackage.package : 0,
            averagePackage: averagePackage.length ? averagePackage[0].avgPackage : 0,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get list of all companies
exports.getCompanies = async (req, res) => {
    try {
        const companies = await Placement.distinct('companyName');
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get placements by company
exports.getPlacementsByCompany = async (req, res) => {
    try {
        const placements = await Placement.find({ companyName: req.params.companyName });
        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get stats grouped by branch
exports.getBranchStats = async (req, res) => {
    try {
        const branchStats = await Placement.aggregate([
            {
                $group: {
                    _id: '$branch',
                    avgPackage: { $avg: '$package' },
                },
            },
        ]);
        res.json(branchStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get placements by branch
exports.getPlacementsByBranch = async (req, res) => {
    try {
        const placements = await Placement.find({ branch: req.params.branchName }).sort({ package: -1 });
        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get highest package by branch
exports.getHighestPackageByBranch = async (req, res) => {
    try {
        const branchStats = await Placement.aggregate([
            {
                $group: {
                    _id: '$branch',
                    maxPackage: { $max: '$package' },
                },
            },
        ]);
        res.json(branchStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all placements
exports.getAllPlacements = async (req, res) => {
    try {
        const placements = await Placement.find().sort({ package: -1 });
        res.json(placements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new placement
exports.createPlacement = async (req, res) => {
    const placement = new Placement({
        ...req.body,
    });

    try {
        const newPlacement = await placement.save();
        res.status(201).json(newPlacement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update placement
exports.updatePlacement = async (req, res) => {
    try {
        const updatedPlacement = await Placement.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedPlacement);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete placement
exports.deletePlacement = async (req, res) => {
    try {
        await Placement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Placement record deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
