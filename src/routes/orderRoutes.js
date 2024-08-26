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

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management routes
 */

/**
 * @swagger
 * /orders/myorders:
 *   get:
 *     summary: Get the authenticated user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of the user's orders
 *       401:
 *         description: Not authorized
 */
router.get('/myorders', protect, getMyOrders);

/**
 * @swagger
 * /orders/purchase-history:
 *   get:
 *     summary: Get the authenticated user's purchase history
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase history of the user
 *       401:
 *         description: Not authorized
 */
router.get('/purchase-history', protect, getPurchaseHistory);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       401:
 *         description: Not authorized
 */
router.get('/:id', protect, getOrderById);

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update the status of an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       404:
 *         description: Order not found
 *       400:
 *         description: Invalid status data
 *       401:
 *         description: Not authorized
 */
router.put('/:id/status', protect, updateOrderStatus);

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getAllOrders);

module.exports = router;