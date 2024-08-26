const express = require('express');
const {
    getTotalRevenue,
    getTopSellingProducts,
    getOrderCountByPeriod,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports and analytics routes
 */

/**
 * @swagger
 * /reports/total-revenue:
 *   get:
 *     summary: Get the total revenue for a specified period
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the revenue report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the revenue report
 *     responses:
 *       200:
 *         description: Total revenue for the specified period
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Not authorized
 */
router.get('/total-revenue', protect, getTotalRevenue);

/**
 * @swagger
 * /reports/top-selling-products:
 *   get:
 *     summary: Get the top-selling products for a specified period
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the report
 *     responses:
 *       200:
 *         description: List of top-selling products
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Not authorized
 */
router.get('/top-selling-products', protect, getTopSellingProducts);

/**
 * @swagger
 * /reports/order-count:
 *   get:
 *     summary: Get the number of orders for a specified period
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the report
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the report
 *     responses:
 *       200:
 *         description: Total order count for the specified period
 *       400:
 *         description: Invalid date range
 *       401:
 *         description: Not authorized
 */
router.get('/order-count', protect, getOrderCountByPeriod);

module.exports = router;