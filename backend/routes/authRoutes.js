const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/roleMiddleware');

// ==================== PUBLIC AUTH ROUTES ====================
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleAuth);

// ==================== PROTECTED AUTH ROUTES ====================
router.get('/me', protect, authController.getCurrentUser);
router.post('/logout', protect, authController.logout);

module.exports = router;
