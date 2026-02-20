const express = require('express');
const router = express.Router();
const pricingController = require('../controllers/pricingController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Public - mitra bisa fetch harga untuk kalkulasi otomatis
router.get('/', pricingController.getAllPricing);
router.get('/key/:service_key', pricingController.getPricingByKey);

// Admin only - update harga
router.put('/:id', authenticateToken, adminOnly, pricingController.updatePricing);

module.exports = router;