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

router.post('/add', protect, validateAddToCart, addToCart);
router.get('/', protect, getCart);
router.put('/update', protect, validateUpdateCartItem, updateCartItem);
router.delete('/remove', protect, validateRemoveFromCart, removeFromCart);

module.exports = router;
