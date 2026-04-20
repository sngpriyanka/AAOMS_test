const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/roleMiddleware');

// ==================== PUBLIC ROUTES ====================
router.get('/track/:trackingNumber', orderController.trackOrder);

// ==================== CUSTOMER ROUTES ====================
router.get('/', protect, orderController.getUserOrders);
router.post('/', protect, orderController.createOrder);
router.get('/:orderId', protect, orderController.getOrderById);
router.patch('/:orderId/cancel', protect, orderController.cancelOrder);

// ==================== ADMIN ONLY ROUTES ====================
router.get('/admin/all', protect, adminOnly, orderController.getAllOrders);
router.patch('/:orderId/status', protect, adminOnly, orderController.updateOrderStatus);

module.exports = router;
