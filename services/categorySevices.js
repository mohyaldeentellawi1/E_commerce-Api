const CategoryModel = require('../models/categoryModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');



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
exports.createCategory = factory.createOne(CategoryModel);

// @desc   Update a category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = factory.updateOne(CategoryModel);

// @desc   Delete a category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel);

//upload category image
exports.uploadCategoryImage = uploadSingleImage('image');

//image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/${fileName}`);
        // Save the image name to the request body
        req.body.image = fileName;
    }
    next();
});









