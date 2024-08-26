const express = require('express');
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', protect, addToWishlist); // Adicionar produto à lista de desejos
router.get('/', protect, getWishlist); // Visualizar lista de desejos
router.delete('/remove', protect, removeFromWishlist); // Remover produto da lista de desejos

module.exports = router;
