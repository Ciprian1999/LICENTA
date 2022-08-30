const mongoose = require('mongoose');
const manufacturers = require('../utils/constants/manufacturers');
const types = require('../utils/constants/types');

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: true,
            lowercase: true,
            required: true,
            maxLength: 150,
            minLength: 10,
        },
        description: {
            type: String,
            required: true,
        },
        manufacturer: {
            type: String,
            required: true,
            enum: manufacturers
        },
        category: {
            type: String,
            required: true,
            enum: types
        },
        price: {
            type: Number,
            required: true,
            min: [0, 'Pretul nu poate fi negativ!'],
            max: [100000, 'Pretul nu poate fi mai mare decat 100000'],
        },
        quantity: {
            type: Number,
            required: true,
            min: [0, 'Cantitatea produsului nu poate fi negativa!'],
            get: (v) => Math.round(v),
            set: (v) => Math.round(v),
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;