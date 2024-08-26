const express = require('express');
const {
    getTotalRevenue,
    getTopSellingProducts,
    getOrderCountByPeriod,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/total-revenue', protect, getTotalRevenue);
router.get('/top-selling-products', protect, getTopSellingProducts);
router.get('/order-count', protect, getOrderCountByPeriod);

module.exports = router;
