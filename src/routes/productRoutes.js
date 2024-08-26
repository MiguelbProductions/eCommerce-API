const express = require('express');
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  searchProducts,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management routes
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - description
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Example Product"
 *               price:
 *                 type: number
 *                 example: 99.99
 *               description:
 *                 type: string
 *                 example: "This is an example product."
 *               category:
 *                 type: string
 *                 example: "Electronics"
 *               stock:
 *                 type: number
 *                 example: 50
 *     responses:
 *       201:
 *         description: Product successfully created
 *       400:
 *         description: Invalid data
 */
router.post('/', protect, addProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   stock:
 *                     type: number
 *       500:
 *         description: Error retrieving products
 */
router.get('/', getProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products based on specific criteria
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Product name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Product category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Minimum rating
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Product brand
 *       - in: query
 *         name: inStock
 *         schema:
 *           type: boolean
 *         description: Whether the product is in stock
 *     responses:
 *       200:
 *         description: List of filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   stock:
 *                     type: number
 *       500:
 *         description: Error performing search
 */
router.get('/search', searchProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Retrieve a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 category:
 *                   type: string
 *                 stock:
 *                   type: number
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error retrieving the product
 */
router.get('/:id', getProductById);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product successfully updated
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid data
 */
router.put('/:id', protect, updateProduct);

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     summary: Add a review to a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Great product!"
 *     responses:
 *       201:
 *         description: Review added successfully
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid data
 */
router.post('/:id/reviews', protect, addReview);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete an existing product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the product
 *     responses:
 *       200:
 *         description: Product successfully deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting the product
 */
router.delete('/:id', protect, deleteProduct);

module.exports = router;