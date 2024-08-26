const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const getTotalRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (!req.user.isAdmin) {
      match.user = req.user._id;
    }

    const totalRevenue = await Order.aggregate([
      { $match: match },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);

    res.status(200).json(totalRevenue[0] || { totalRevenue: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error generating total revenue report', error: error.message });
  }
};

const getTopSellingProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (!req.user.isAdmin) {
      const productsByUser = await Product.find({ user: req.user._id }).select('_id');
      match['items.product'] = { $in: productsByUser.map((product) => product._id) };
    }

    const topSellingProducts = await Order.aggregate([
      { $match: match },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json(topSellingProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error generating top selling products report', error: error.message });
  }
};

const getOrderCountByPeriod = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const match = {};
    if (startDate && endDate) {
      match.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    if (!req.user.isAdmin) {
      match.user = req.user._id;
    }

    const orderCount = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(orderCount[0] || { totalOrders: 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error generating order count report', error: error.message });
  }
};

module.exports = {
  getTotalRevenue,
  getTopSellingProducts,
  getOrderCountByPeriod,
};
