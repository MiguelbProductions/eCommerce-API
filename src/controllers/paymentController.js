const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel'); // Assumindo que você vai criar um modelo de pedido
const Product = require('../models/productModel');

const processPayment = async (req, res) => {
  try {
    const { paymentMethodId, currency = 'usd' } = req.body;

    // Encontrar o carrinho do usuário
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Calcular o valor total
    const amount = cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);

    // Crie o pagamento no Stripe com return_url
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // O valor é em centavos
      currency,
      payment_method: paymentMethodId,
      confirm: true,
      return_url: 'https://your-website.com/return-url', // Substitua pelo URL apropriado
    });

    // Criar um pedido no banco de dados
    const order = new Order({
      user: req.user._id,
      items: cart.items,
      total: amount,
      paymentIntentId: paymentIntent.id,
      status: 'paid',
    });

    // Reduzir o estoque dos produtos comprados
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      product.stock -= item.quantity;
      await product.save();
    }

    // Salvar o pedido
    await order.save();

    // Limpar o carrinho
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // Enviar a resposta de sucesso
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
