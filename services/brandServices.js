const BrandModel = require('../models/brandsModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');


// @desc   Get all Brands
// @route  GET /api/v1/brands
// @access Public
exports.getBrands = asyncHandler( async (req,res) => {
const page = req.query.page * 1 || 1;
const limit = req.query.limit * 1 || 50;
const skip = (page - 1) * limit;    
const brands = await BrandModel.find({}).skip(skip).limit(limit);
res.status(200).json({results:brands.length, page,data: brands });
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
exports.updateBrand = asyncHandler(async (req,res,next)=>{
const { id } = req.params;
const { name } = req.body;
const brand = await BrandModel.findOneAndUpdate({_id:id},{name , slug:slugify(name)} ,{new:true});
if(!brand){
return next(new ApiError(`Brand not found with id of ${id}`, 404));
}
res.status(200).json({data: brand});
});

// @desc   Delete a Brand
// @route  DELETE /api/v1/brands/:id
// @access Private
exports.deleteBrand = asyncHandler( async (req,res, next)=>{
const { id } = req.params;
const brand = await BrandModel.findByIdAndDelete(id);
if(!brand){
return next(new ApiError(`Brand not found with id of ${id}`, 404));
}
res.status(204).send();
});