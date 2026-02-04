const express = require('express');
const router = express.Router();
const {
  createOrder,
  trackOrder,
  updateOrderStatus,
  getOrdersByPartner,
  getOrderDetails
} = require('../controllers/orderController');

// Import auth middleware
const { authenticateToken, checkRole, mitraOnly, adminOnly } = require('../middleware/authMiddleware');

/**
 * POST /api/orders
 * Create order baru oleh mitra
 * Requires: Mitra authentication
 */
router.post('/', authenticateToken, checkRole('mitra', 'admin'), createOrder);

/**
 * GET /api/orders/track/:kode
 * Track order pakai kode laundry (untuk customer)
 * PUBLIC endpoint - no auth required
 */
router.get('/track/:kode', trackOrder);

/**
 * GET /api/orders/partner/:partnerId
 * Get semua order dari mitra tertentu
 * Requires: Authentication (mitra hanya bisa lihat order sendiri, admin bisa semua)
 */
router.get('/partner/:partnerId', authenticateToken, getOrdersByPartner);

/**
 * GET /api/orders/:orderId
 * Get detail order specific
 * Requires: Authentication
 */
router.get('/:orderId', authenticateToken, getOrderDetails);

/**
 * PUT /api/orders/:orderId/status
 * Update status order
 * Requires: Mitra or Admin authentication
 */
router.put('/:orderId/status', authenticateToken, checkRole('mitra', 'admin'), updateOrderStatus);

module.exports = router;