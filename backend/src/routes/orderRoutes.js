const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Public route - track order tanpa auth
router.get('/track/:kode', orderController.trackOrder);

// All routes below require authentication
router.use(authenticate);

// Get dashboard stats (mitra only)
router.get('/stats/dashboard', orderController.getDashboardStats);

// Get ALL orders - Admin Only
router.get('/admin/all', isAdmin, orderController.getAllOrdersAdmin);

// Create new order (mitra only)
router.post('/', orderController.createOrder);

// Get all orders (untuk mitra yang login)
router.get('/', orderController.getAllOrders);

// Get order details by ID
router.get('/:id', orderController.getOrderById);

// Update order status
router.patch('/:id/status', orderController.updateOrderStatus);

// Update order (edit data)
router.put('/:id', orderController.updateOrder);

// Delete order (mitra only)
router.delete('/:id', orderController.deleteOrder);

module.exports = router;