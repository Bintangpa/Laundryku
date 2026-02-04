const express = require('express');
const router = express.Router();
const partnerController = require('../controllers/partnerController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public routes - get all partners (for frontend display)
router.get('/', partnerController.getAllPartners);
router.get('/:id', partnerController.getPartnerById);

// Protected routes - require authentication
router.post('/', authenticate, isAdmin, partnerController.createPartner);
router.put('/:id', authenticate, partnerController.updatePartner);
router.delete('/:id', authenticate, isAdmin, partnerController.deletePartner);

module.exports = router;