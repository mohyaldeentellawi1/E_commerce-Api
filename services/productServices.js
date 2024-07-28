const ProductModel = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadMultipleImages} = require('../middleware/uploadImageMiddleware');
const factory = require('./handlersFactory');


exports.uploadProductImages = uploadMultipleImages([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 5 },
]);

// @desc   Image processing for image cover and images for product
exports.productImageProcessing = asyncHandler(async (req, res, next) => {
    if(req.files.imageCover){
        const imageCoverFileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
    await sharp(req.files.imageCover[0].buffer)
    .resize(2000,1333)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/products/${imageCoverFileName}`);
    // Save the image cover name in Database
        req.body.imageCover = imageCoverFileName;
    }
    if(req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async(image,index)=>{
                const imageName = `product-${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
                await sharp(image.buffer)
                    .resize(2000,1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 95 })
                    .toFile(`uploads/products/${imageName}`);
                    // Save the images name in Database
                    req.body.images.push(imageName);
            }));
        }
        next();
});

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



