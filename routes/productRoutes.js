const express = require('express');
const router = express.Router();
const {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// @route   POST /api/products
// @desc    Create a new product
router.post('/', createProduct);

// @route   GET /api/products
// @desc    Get all products (sorted by newest first)
router.get('/', getProducts);

// @route   PUT /api/products/:id
// @desc    Update an existing product
router.put('/:id', updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', deleteProduct);

module.exports = router;
