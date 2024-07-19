const mongoose = require('mongoose');

let productsschema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    Category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorydb',
        required: true
    },
    brand: {
        type: String
    },
    price: {
        type: Number
    },
    color: {
        type: String
    },
    size: {
        type: String
    },
    description: {
        type: String
    },
    list: {
        type: String,
        default: 'listed'
    },
    discount: {
        type: Number
    },
    stock: {
        type: Number,
        required: true
    },
    images: {
        type: [String]
    },
    offerPrice: {
        type: Number,
    },
    count:{
        type:Number,
        default:0
    }
});

const productdb = mongoose.model('product', productsschema);
module.exports = productdb;
