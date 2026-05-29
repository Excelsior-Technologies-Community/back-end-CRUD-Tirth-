const mongoose = require('mongoose');

// Define the schema for a product
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    }
}, {
    collection: 'products',
    timestamps: true
});

// Create and export the Product model
module.exports = mongoose.model('Product', productSchema);
