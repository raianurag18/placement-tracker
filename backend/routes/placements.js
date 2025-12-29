const express = require('express');
const router = express.Router();
const { isAdmin, protect } = require('../middleware/authMiddleware');
const placementController = require('../controllers/placementController');
const { validatePlacement } = require('../validators/placementValidator');

router.get('/stats', placementController.getStats);
router.get('/companies', placementController.getCompanies);
router.get('/companies/:companyName', placementController.getPlacementsByCompany);
router.get('/stats/branch', placementController.getBranchStats);
router.get('/branch/:branchName', placementController.getPlacementsByBranch);
router.get('/stats/branch/highest', placementController.getHighestPackageByBranch);
router.get('/all', placementController.getAllPlacements);
router.post('/', protect, isAdmin, validatePlacement, placementController.createPlacement);
router.patch('/:id', protect, isAdmin, validatePlacement, placementController.updatePlacement);
router.delete('/:id', protect, isAdmin, placementController.deletePlacement);

module.exports = router;
