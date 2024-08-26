const express = require('express');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management routes
 */

/**
 * @swagger
 * /wishlist/add:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "603d2149e07f05317c1e0c84"
 *     responses:
 *       200:
 *         description: Product added to wishlist successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid data
 */
router.post('/add', protect, addToWishlist);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get the authenticated user's wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's wishlist
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getWishlist);

/**
 * @swagger
 * /wishlist/remove:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "603d2149e07f05317c1e0c84"
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       404:
 *         description: Product not found in wishlist
 *       400:
 *         description: Invalid data
 */
router.delete('/remove', protect, removeFromWishlist);

module.exports = router;