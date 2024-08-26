const { body, validationResult } = require('express-validator');

const validateAddToCart = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID')
    .notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    .notEmpty().withMessage('Quantity is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateUpdateCartItem = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID')
    .notEmpty().withMessage('Product ID is required'),
  body('quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1')
    .notEmpty().withMessage('Quantity is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

const validateRemoveFromCart = [
  body('productId')
    .isMongoId().withMessage('Invalid product ID')
    .notEmpty().withMessage('Product ID is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateAddToCart,
  validateUpdateCartItem,
  validateRemoveFromCart,
};