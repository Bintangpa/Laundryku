const router = require('express').Router();
const adminController = require('../controllers/Admincontroller');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// Middleware untuk cek role admin sudah ada di auth.js, jadi gak perlu bikin lagi

router.put('/update-email', authenticateToken, adminOnly, adminController.updateEmail);
router.put('/update-password', authenticateToken, adminOnly, adminController.updatePassword);

module.exports = router;