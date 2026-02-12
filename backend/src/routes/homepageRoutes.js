const router = require('express').Router();
const homepageController = require('../controllers/homepageController');
const { authenticateToken, adminOnly } = require('../middleware/auth');

// ============================================
// HERO SECTION
// ============================================
// Public - dipakai HeroSection.tsx
router.get('/hero', homepageController.getHero);
// Admin only
router.put('/hero', authenticateToken, adminOnly, homepageController.updateHero);

// ============================================
// SERVICES SECTION
// ============================================
// Public - dipakai ServicesSection.tsx
router.get('/services', homepageController.getServices);
// Admin only
router.put('/services', authenticateToken, adminOnly, homepageController.updateServicesSection);
router.post('/services/items', authenticateToken, adminOnly, homepageController.addServiceItem);
router.put('/services/items/:id', authenticateToken, adminOnly, homepageController.updateServiceItem);
router.delete('/services/items/:id', authenticateToken, adminOnly, homepageController.deleteServiceItem);

// ============================================
// FOOTER SECTION
// ============================================
// Public - dipakai Footer.tsx
router.get('/footer', homepageController.getFooter);
// Admin only
router.put('/footer', authenticateToken, adminOnly, homepageController.updateFooter);

module.exports = router;