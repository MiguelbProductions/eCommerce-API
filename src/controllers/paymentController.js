const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Coupon = require('../models/couponModel');
const { createNotification } = require('../controllers/notificationController');

const processPayment = async (req, res) => {
  try {
    const { paymentMethodId, currency = 'usd', couponCode } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    let amount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found or inactive' });
      }

      if (coupon.usedCount >= coupon.maxUses) {
        return res.status(400).json({ message: 'Coupon has been fully used' });
      }

      if (new Date() > coupon.expiryDate) {
        return res.status(400).json({ message: 'Coupon has expired' });
      }

      if (coupon.discountType === 'percentage') {
        amount -= (amount * coupon.discountValue) / 100;
      } else if (coupon.discountType === 'fixed') {
        amount -= coupon.discountValue;
      }

      coupon.usedCount += 1;
      await coupon.save();
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method: paymentMethodId,
      confirm: true,
    });

    const order = new Order({
      user: req.user._id,
      items: cart.items,
      total: amount,
      paymentIntentId: paymentIntent.id,
      status: 'paid',
    });

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
    res.status(500).json({ message: 'Error processing payment', error: error.message });
  }
};

module.exports = { processPayment };
