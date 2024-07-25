const BrandModel = require('../models/brandsModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage} = require('../middleware/uploadImageMiddleware');


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

//upload brand image
exports.uploadBrandImage = uploadSingleImage('image');

//image processing
exports.imageProcessing = asyncHandler( async (req, res, next) => {
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${fileName}`);
    // Save the image name to the request body
    req.body.image = fileName;
    next();
});