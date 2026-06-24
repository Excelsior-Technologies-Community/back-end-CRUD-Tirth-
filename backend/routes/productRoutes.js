const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Import JWT protection middleware
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/products
// @desc    Create a new product (Protected)
router.post('/', protect, createProduct);

// @route   GET /api/products
// @desc    Get all products (sorted by newest first) (Public)
router.get('/', getProducts);

// @route   GET /api/products/:id
// @desc    Get a single product by ID (Public)
router.get('/:id', getProductById);

// @route   PUT /api/products/:id
// @desc    Update an existing product (Protected)
router.put('/:id', protect, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product (Protected)
router.delete('/:id', protect, deleteProduct);

module.exports = router;
