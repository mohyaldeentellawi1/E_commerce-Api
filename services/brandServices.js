const BrandModel = require('../models/brandsModel');
const factory = require('./handlersFactory');


// @desc   Get all Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = factory.getAll(BrandModel);


// @desc   Get a specific Brand
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = factory.getOne(BrandModel);

// @desc   Create a new Brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand =  factory.createOne(BrandModel);
// @desc   Update a Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc   Delete a Brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(BrandModel);