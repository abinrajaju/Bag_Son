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
    }
});

const productdb = mongoose.model('product', productsschema);
module.exports = productdb;
