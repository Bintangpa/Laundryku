const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, isAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Admin dashboard
router.get('/admin', isAdmin, dashboardController.getAdminStats);

// Mitra dashboard
router.get('/mitra', dashboardController.getMitraStats);

module.exports = router;