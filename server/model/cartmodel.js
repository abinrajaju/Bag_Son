const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'userdb',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number

        }
    }],
    couponApplied: {
        type: Boolean,
        default: false
    },
    totalAmount: {
        type: Number
    },
    totalDiscount: {
        type: Number
    },
    balance:{
        type:Number
    }

}, { timestamps: true });


const cartdb = mongoose.model('cartdb', cartSchema)

module.exports = cartdb;