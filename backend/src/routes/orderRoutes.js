const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public route - track order tanpa auth
router.get('/track/:kode', orderController.trackOrder);

// All routes below require authentication
router.use(authenticate);

// Create new order (mitra only)
router.post('/', orderController.createOrder);

// Get orders by partner
router.get('/partner/:partnerId', orderController.getOrdersByPartner);

// Get order details by ID
router.get('/:orderId', orderController.getOrderDetails);

// Update order status
router.patch('/:orderId/status', orderController.updateOrderStatus);

module.exports = router;