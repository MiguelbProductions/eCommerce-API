const Cart = require('../models/cartModel');
const Product = require('../models/productModel');

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} items in stock` });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({
                user: req.user._id,
                items: [{ product: productId, quantity }],
                totalPrice: product.price * quantity,
            });
        } else {
            const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

            if (itemIndex > -1) {
                const existingItem = cart.items[itemIndex];

                if (existingItem.quantity + quantity > product.stock) {
                    return res.status(400).json({ message: `Only ${product.stock - existingItem.quantity} more items can be added to the cart` });
                }

                existingItem.quantity += quantity;
                cart.items[itemIndex] = existingItem;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            cart.totalPrice += product.price * quantity;
        }

        await cart.save();
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding to cart', error });
    }
};


const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const totalPrice = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
        res.status(200).json({ ...cart.toObject(), totalPrice });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (quantity > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} items in stock` });
        }

        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId);

        if (itemIndex > -1) {
            const item = cart.items[itemIndex];

            cart.totalPrice -= item.quantity * item.product.price;
            item.quantity = quantity;
            cart.totalPrice += item.quantity * item.product.price;

            cart.items[itemIndex] = item;
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body;

        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex((item) => item.product._id.toString() === productId);

        if (itemIndex > -1) {
            const item = cart.items[itemIndex];

            cart.totalPrice -= item.quantity * item.product.price;
            cart.items.splice(itemIndex, 1);

            await cart.save();
        } else {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error removing from cart', error: error.message });
    }
};


module.exports = {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
};