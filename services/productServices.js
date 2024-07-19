const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');


// @desc   Get all products
// @route  GET /api/v1/products
// @access Public
exports.getProducts = asyncHandler( async (req,res) => {
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 20;
const skip = (page - 1) * limit;    
const products = await ProductModel.find({}).skip(skip).limit(limit).populate({path:'category', select:'name'});
res.status(200).json({results:products.length, page,data: products });
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
exports.updateProduct = asyncHandler(async (req,res,next)=>{
    const { id } = req.params;
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    const product = await ProductModel.findOneAndUpdate({_id:id},req.body,{new:true});
    if(!product){
    return next(new ApiError(`Product not found with id of ${id}`, 404));
    }
    res.status(200).json({data: product});
    });   

// @desc   Delete a product
// @route  DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = asyncHandler( async (req,res, next)=>{
    const { id } = req.params;
    const product = await ProductModel.findByIdAndDelete(id);
    if(!product){
    return next(new ApiError(`Product not found with id of ${id}`, 404));
    }
    res.status(204).send();
    });