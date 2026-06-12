const express = require('express');
const router = express.Router();
const { isAdmin, protect } = require('../middleware/authMiddleware');
const placementController = require('../controllers/placementController');
const { validatePlacement } = require('../validators/placementValidator');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/stats', protect, asyncHandler(placementController.getStats));
router.get('/companies', protect, asyncHandler(placementController.getCompanies));
router.get('/companies/:companyName', protect, asyncHandler(placementController.getPlacementsByCompany));
router.get('/stats/branch', protect, asyncHandler(placementController.getBranchStats));
router.get('/branch/:branchName', protect, asyncHandler(placementController.getPlacementsByBranch));
router.get('/stats/branch/highest', protect, asyncHandler(placementController.getHighestPackageByBranch));
router.get('/all', protect, asyncHandler(placementController.getAllPlacements));
router.post('/', protect, isAdmin, validatePlacement, asyncHandler(placementController.createPlacement));
router.patch('/:id', protect, isAdmin, validatePlacement, asyncHandler(placementController.updatePlacement));
router.delete('/:id', protect, isAdmin, asyncHandler(placementController.deletePlacement));

module.exports = router;
