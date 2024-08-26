const express = require('express');
const { processPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing routes
 */

/**
 * @swagger
 * /payment/pay:
 *   post:
 *     summary: Process a payment
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - paymentMethodId
 *               - currency
 *             properties:
 *               paymentMethodId:
 *                 type: string
 *                 example: "pm_card_visa"
 *               currency:
 *                 type: string
 *                 example: "usd"
 *               couponCode:
 *                 type: string
 *                 example: "SAVE10"
 *                 description: Optional coupon code for discount
 *     responses:
 *       200:
 *         description: Payment processed successfully
 *       400:
 *         description: Invalid payment data
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Error processing payment
 */
router.post('/pay', protect, processPayment);

module.exports = router;