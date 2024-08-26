const express = require('express');
const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
  searchProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, addProduct);
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProductById);
router.put('/:id', protect, updateProduct);
router.post('/:id/reviews', protect, addReview);
router.delete('/:id', protect, deleteProduct);

module.exports = router;
