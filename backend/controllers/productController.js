const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Public
 */
const createProduct = async (req, res) => {
    try {
        const { name, price, category, image } = req.body;

        // Simple validation check
        if (!name || price === undefined || !category) {
            console.error('API Errors: Missing required fields (name, price, or category)');
            return res.status(400).json({
                success: false,
                message: 'Please provide name, price, and category'
            });
        }

        console.log(`[PRODUCT CREATION] Request received for: ${JSON.stringify({ name, price, category })}`);
        console.log('[PRODUCT CREATION] Attempting to save new Product document in MongoDB Atlas...');

        // Create new product in database
        const newProduct = new Product({
            name,
            price,
            category,
            image
        });

        const savedProduct = await newProduct.save();
        console.log(`[PRODUCT SAVE] Product document saved successfully! ID: ${savedProduct._id}, Collection: stocksync.products`);

        res.status(201).json({
            success: true,
            message: 'Product added successfully!',
            data: savedProduct
        });
    } catch (error) {
        console.error('[PRODUCT CREATION] Database insertion failed during product save:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while adding product',
            error: error.message
        });
    }
};

/**
 * @desc    Get all products (sorted by newest first)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
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
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Public
 */
const updateProduct = async (req, res) => {
    try {
        const { name, price, category, image } = req.body;

        // Find the product by ID and update it
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { name, price, category, image },
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
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Public
 */
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            console.error('API Errors: Product to delete not found');
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Optionally remove uploaded image file if it was uploaded by user
        const imageFilename = deletedProduct.image;
        const defaultImages = [
            'car.png', 'bottle.jpg', 'laptop.jpg', 'wireless_gaming_mouse.jpg', 'gaming_mouse.jpg',
            'smartwatch.jpg', 'headphones.jpg', 'shoes.jpg', 'backpack.jpg', 'camera.jpg'
        ];
        if (imageFilename && !defaultImages.includes(imageFilename)) {
            const filePath = path.join(__dirname, '../uploads', imageFilename);
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Error deleting file:', err);
                    else console.log('Deleted uploaded image file:', imageFilename);
                });
            }
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
};

/**
 * @desc    Get a single product by ID (Public)
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            console.error('API Errors: Product not found');
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('API Errors:', error.message);
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error while fetching product',
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
