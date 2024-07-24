const CategoryModel = require('../models/categoryModel');
const factory = require('./handlersFactory');


// @desc   Get all categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = factory.getAll(CategoryModel);


// @desc   Get a specific category
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = factory.getOne(CategoryModel);

// @desc   Create a new category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory =  factory.createOne(CategoryModel);

// @desc   Update a category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc   Delete a category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel);