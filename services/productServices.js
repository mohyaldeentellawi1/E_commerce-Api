const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiFeatures = require('../utils/apiFeatures');
const ApiError = require('../utils/apiError');
const factory = require('./handlersFactory');


// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler( async (req,res) => {
// 1. Filtering  
// 2. Pagination
// 3. Sorting
// 4. Field limiting
// 5. Searching

// Build the query
const countDocuments = await ProductModel.countDocuments();
const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .filter()
    .paginate(countDocuments)
    .sort()
    .fieldLimiting()
    .search("Product");

//populate({path:'category', select:'name'})
// Execute the query
const { mongooseQuery, paginationResult } = apiFeatures;
const products = await mongooseQuery;

res.status(200).json({results:products.length , paginationResult, data: products });
});


// @desc   Get a specific product
// @route  GET /api/v1/products/:id
// @access Public
exports.getProduct = asyncHandler( async (req,res , next)=> {
const { id } = req.params;
const product = await ProductModel.findById(id).populate({path:'category', select:'name'});
if(!product){
return next(new ApiError(`Product not found with id of ${id}`, 404));
} 
res.status(200).json({data: product});
});

// @desc   Create a new product
// @route  POST /api/v1/products
// @access Private
exports.createProduct =   asyncHandler(async  (req,res) => {
    req.body.slug = slugify(req.body.title);
    const product = await  ProductModel.create(req.body);
    res.status(201).json({data: product})   
    });

// @desc   Update a product
// @route  PUT /api/v1/products/:id
// @access Private
exports.updateProduct = factory.updateOne(ProductModel); 

// @desc   Delete a product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = factory.deleteOne(ProductModel);