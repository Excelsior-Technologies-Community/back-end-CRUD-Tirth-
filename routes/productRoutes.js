const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route   POST /api/products
// @desc    Create a new product
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, price, category } = req.body;

        // Simple validation check
        if (!name || price === undefined || !category) {
            console.error('API Errors: Missing required fields (name, price, or category)');
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide name, price, and category' 
            });
        }

        // Create new product in database
        const newProduct = new Product({
            name,
            price,
            category
        });

        const savedProduct = await newProduct.save();
        console.log('Product Added Successfully');

        res.status(201).json({
            success: true,
            message: 'Product added successfully!',
            data: savedProduct
        });
    } catch (error) {
        console.error('API Errors:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while adding product',
            error: error.message
        });
    }
});

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all products sorted by createdAt descending
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('API Errors:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching products',
            error: error.message
        });
    }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product
// @access  Public
router.put('/:id', async (req, res) => {
    try {
        const { name, price, category } = req.body;

        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, category },
            { returnDocument: 'after', runValidators: true }
        );

        if (!updatedProduct) {
            console.error('API Errors: Product to update not found');
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Product Updated');
        res.status(200).json({
            success: true,
            message: 'Product updated successfully!',
            data: updatedProduct
        });
    } catch (error) {
        console.error('API Errors:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while updating product',
            error: error.message
        });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            console.error('API Errors: Product to delete not found');
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log('Product Deleted');
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully!',
            data: deletedProduct
        });
    } catch (error) {
        console.error('API Errors:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting product',
            error: error.message
        });
    }
});

module.exports = router;
