const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * POST /api/auth/register
 * Register mitra baru
 * Public endpoint
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login untuk admin & mitra
 * Public endpoint
 */
router.post('/login', login);

/**
 * GET /api/auth/profile
 * Get user profile
 * Requires authentication
 */
router.get('/profile', authenticateToken, getProfile);

/**
 * PUT /api/auth/profile
 * Update profile (untuk mitra)
 * Requires authentication
 */
router.put('/profile', authenticateToken, updateProfile);

/**
 * PUT /api/auth/change-password
 * Change password
 * Requires authentication
 */
router.put('/change-password', authenticateToken, changePassword);

module.exports = router;