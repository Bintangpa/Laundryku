const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { authenticate, isAdmin } = require('../middleware/auth');

// IMPORTANT: Place specific routes BEFORE parameterized routes
// This prevents '/available/cities' from being caught by '/:id'

// Public routes
router.get('/available/cities', partnerController.getAvailableCities);
router.get('/city/:city', partnerController.getPartnersByCity);
router.get('/', partnerController.getAllPartners);

// 🆕 NEW: Protected routes for mitra dashboard
router.get('/profile/me', authenticate, partnerController.getMyProfile);
router.put('/profile/me', authenticate, partnerController.updateMyProfile);

// Admin/Mitra routes
router.get('/:id', partnerController.getPartnerById);
router.post('/', authenticate, isAdmin, partnerController.createPartner);
router.put('/:id', authenticate, partnerController.updatePartner);
router.patch('/:id/toggle-status', authenticate, isAdmin, partnerController.togglePartnerStatus); // 🆕 NEW: Toggle active/inactive
router.delete('/:id', authenticate, isAdmin, partnerController.deletePartner);

module.exports = router;