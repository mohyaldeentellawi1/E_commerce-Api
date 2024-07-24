const CategoryModel = require('../models/categoryModel');
const multer = require('multer');
const AppError = require('../utils/apiError');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');
const asyncHandler = require('express-async-handler');


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


// Disk Storage Engine
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/categories');
//     },
//     filename: (req, file, cb) => {
//         const ext = file.mimetype.split('/')[1];
//         const fileName = `category-${uuidv4()}-${Date.now()}.${ext}`;
//         cb(null, fileName);
//     }
// });


// memory storage engine as buffer
const multerStorage = multer.memoryStorage();

// Multer Filter
const multerFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
        cb(null, true);
    } else{
        cb(new ApiError('Not an image! Please upload only images.', 400), false);
    }
};
// @desc upload category image
// @route  POST /api/v1/categories
// @access Private
const upload = multer({ storage: multerStorage ,fileFilter: multerFilter});
exports.uploadCategoryImage = upload.single('image');

// Process uploaded image
exports.imageProcessing = asyncHandler( async (req, res, next) => {
        const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`uploads/categories/${fileName}`);
        next();
    });