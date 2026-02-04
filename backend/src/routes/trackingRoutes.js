const express = require('express');
const router = express.Router();
const trackingController = require('../controllers/trackingController');

// Public route - no authentication required
router.get('/:code', trackingController.trackOrder);

module.exports = router;