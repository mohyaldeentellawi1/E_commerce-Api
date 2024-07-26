const express = require('express');
const { getProduct, getProducts , createProduct , updateProduct , deleteProduct , uploadProductImages, productImageProcessing } = require('../services/productServices');
const { getProdcutValidator, createProductValidator , updateProductValidator , deleteProductValidator } = require('../utils/validators_rules/productValidators');
const router = express.Router();

router.route('/').get(getProducts).post(uploadProductImages, productImageProcessing, createProductValidator, createProduct);
router.route('/:id')
.get(getProdcutValidator, getProduct)
.put(updateProductValidator , updateProduct)
.delete(deleteProductValidator, deleteProduct);

module.exports = router;