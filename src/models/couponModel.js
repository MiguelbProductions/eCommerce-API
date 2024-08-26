const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: true,
    },
    maxUses: {
        type: Number,
        default: 1,
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;