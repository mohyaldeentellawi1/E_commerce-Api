const BrandModel = require('../models/brandsModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlersFactory');


// @desc   Get all Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler( async (req,res) => {
const countDocuments = await BrandModel.countDocuments();
const apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
    .filter()
    .paginate(countDocuments)
    .sort()
    .fieldLimiting()
    .search();
//populate({path:'category', select:'name'})
// Execute the query
const { mongooseQuery, paginationResult } = apiFeatures;
const brands = await mongooseQuery;
res.status(200).json({results:brands.length , paginationResult, data: brands });
});


// @desc   Get a specific Brand
// @route  GET /api/v1/brands/:id
// @access Public
exports.getBrand = asyncHandler( async (req,res , next)=> {
const { id } = req.params;
const brand = await BrandModel.findById(id);
if(!brand){
return next(new ApiError(`Brand not found with id of ${id}`, 404));
} 
res.status(200).json({data: brand});
});

// @desc   Create a new Brand
// @route  POST /api/v1/brands
// @access Private
exports.createBrand =   asyncHandler(async  (req,res) => {
const { name } = req.body;
const brand = await  BrandModel.create({ name , slug : slugify(name)});
res.status(201).json({data: brand})   
});

// @desc   Update a Brand
// @route  PUT /api/v1/brands/:id
// @access Private
exports.updateBrand = factory.updateOne(BrandModel);

// @desc   Delete a Brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = factory.deleteOne(BrandModel);