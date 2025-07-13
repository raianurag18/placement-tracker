const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');

router.get('/stats', async (req, res) => {
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
});

router.get('/companies', async (req, res) => {
  try {
    const companies = await Placement.distinct('companyName');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/companies/:companyName', async (req, res) => {
  try {
    const placements = await Placement.find({ companyName: req.params.companyName });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/branch', async (req, res) => {
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
});

router.get('/branch/:branchName', async (req, res) => {
  try {
    const placements = await Placement.find({ branch: req.params.branchName }).sort({ package: -1 });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/stats/branch/highest', async (req, res) => {
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
});

router.get('/all', async (req, res) => {
  try {
    const placements = await Placement.find().sort({ package: -1 });
    res.json(placements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
