const express = require('express');
const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');
const {
    validateAddToCart,
    validateUpdateCartItem,
    validateRemoveFromCart,
} = require('../validators/cartValidators');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management routes
 */

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "603d2149e07f05317c1e0c84"
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.post('/add', protect, validateAddToCart, addToCart);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart
 *       401:
 *         description: Not authorized
 */
router.get('/', protect, getCart);

/**
 * @swagger
 * /cart/update:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "603d2149e07f05317c1e0c84"
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.put('/update', protect, validateUpdateCartItem, updateCartItem);

/**
 * @swagger
 * /cart/remove:
 *   delete:
 *     summary: Remove a product from the cart
 *     tags: [Cart]
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
 *         description: Product removed from cart successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Not authorized
 */
router.delete('/remove', protect, validateRemoveFromCart, removeFromCart);

module.exports = router;