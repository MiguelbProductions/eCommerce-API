const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { createNotification } = require('../controllers/notificationController');

const processPayment = async (req, res) => {
  try {
    const { paymentMethodId, currency = 'usd' } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const amount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://your-website.com/return-url',
    });

    const order = new Order({
      user: req.user._id,
      items: cart.items,
      total: amount,
      paymentIntentId: paymentIntent.id,
      status: 'paid',
    });

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    await order.save();

    await createNotification(req.user._id, `Your order #${order._id} has been successfully placed.`, 'Order Update');

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({
      message: 'Payment successful',
      order,
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

module.exports = { processPayment };
