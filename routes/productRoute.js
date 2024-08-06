const express = require('express');
const { getProduct, getProducts, createProduct, updateProduct, deleteProduct, uploadProductImages, productImageProcessing } = require('../services/productServices');
const { protect, allowTo } = require('../services/authServices');
const { getProdcutValidator, createProductValidator, updateProductValidator, deleteProductValidator } = require('../utils/validators_rules/productValidators');
const router = express.Router();

router.route('/').get(getProducts).post(
    protect, allowTo("admin", 'manager'),
    uploadProductImages, productImageProcessing, createProductValidator, createProduct);
router.route('/:id')
    .get(getProdcutValidator, getProduct)
    .put(
        protect, allowTo("admin", 'manager'),
        updateProductValidator, updateProduct)
    .delete(
        protect, allowTo("admin", 'manager'),
        deleteProductValidator, deleteProduct);

module.exports = router;