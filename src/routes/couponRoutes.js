const express = require('express');
const {
  createCoupon,
  listCoupons,
  deleteCoupon,
  applyCoupon,
} = require('../controllers/couponController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Coupon management routes
 */

/**
 * @swagger
 * /coupons/create:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *               - expiryDate
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SAVE10"
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: "percentage"
 *               discountValue:
 *                 type: number
 *                 example: 10
 *               maxUses:
 *                 type: number
 *                 example: 100
 *                 description: Optional maximum uses of the coupon
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.post('/create', protect, createCoupon);

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: List all coupons
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of coupons
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, listCoupons);

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the coupon to delete
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       404:
 *         description: Coupon not found
 *       401:
 *         description: Not authorized
 */
router.delete('/:id', protect, deleteCoupon);

/**
 * @swagger
 * /coupons/apply:
 *   post:
 *     summary: Apply a coupon to the current cart
 *     tags: [Coupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SAVE10"
 *     responses:
 *       200:
 *         description: Coupon applied successfully
 *       400:
 *         description: Invalid coupon code
 *       401:
 *         description: Not authorized
 */
router.post('/apply', protect, applyCoupon);

module.exports = router;