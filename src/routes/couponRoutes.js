const express = require('express');
const {
  createCoupon,
  listCoupons,
  deleteCoupon,
  applyCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create', protect, createCoupon);
router.get('/', protect, listCoupons);
router.delete('/:id', protect, deleteCoupon);

router.post('/apply', protect, applyCoupon);

module.exports = router;
