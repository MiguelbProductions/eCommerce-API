const express = require('express');
const {
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
  getPurchaseHistory
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/myorders', protect, getMyOrders);
router.get('/purchase-history', protect, getPurchaseHistory);
router.get('/:id', protect, getOrderById);

router.put('/:id/status', protect, updateOrderStatus);
router.get('/', protect, getAllOrders);

module.exports = router;
