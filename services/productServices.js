const ProductModel = require('../models/productModel');
const factory = require('./handlersFactory');


// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = factory.getAll(ProductModel, 'Product');


// @desc   Get a specific product
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = factory.getOne(ProductModel);
// @desc   Create a new product
// @route  POST /api/v1/products
// @access Private
exports.createProduct = factory.createOne(ProductModel);

// @desc   Update a product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(ProductModel); 

// @desc   Delete a product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(ProductModel);