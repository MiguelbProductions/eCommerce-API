const Coupon = require('../models/couponModel');

const createCoupon = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied, only admins can create coupons' });
    }

    try {
        const { code, discountType, discountValue, maxUses, expiryDate } = req.body;

        const coupon = new Coupon({
            code,
            discountType,
            discountValue,
            maxUses,
            expiryDate,
        });

        await coupon.save();
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error creating coupon', error: error.message });
    }
};

const listCoupons = async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied, only admins can list coupons' });
    }

    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coupons', error: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied, only admins can delete coupons' });
    }
  
    try {
      const coupon = await Coupon.findById(req.params.id);
  
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      await coupon.deleteOne();
  
      res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting coupon', error: error.message });
    }
  };

const applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;

        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found or inactive' });
        }

        if (coupon.usedCount >= coupon.maxUses) {
            return res.status(400).json({ message: 'Coupon has been fully used' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        res.status(200).json(coupon);
    } catch (error) {
        res.status(500).json({ message: 'Error applying coupon', error: error.message });
    }
};

module.exports = {
    createCoupon,
    listCoupons,
    deleteCoupon,
    applyCoupon,
};
