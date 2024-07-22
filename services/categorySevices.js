const CategoryModel = require('../models/categoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const factory = require('./handlersFactory');


// @desc   Get all categories
// @route  GET /api/v1/categories
// @access Public
exports.getCategories = asyncHandler( async (req,res) => {
    const countDocuments = await CategoryModel.countDocuments();
    const apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
        .filter()
        .paginate(countDocuments)
        .sort()
        .fieldLimiting()
        .search();
    // Execute the query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const categories = await mongooseQuery;
res.status(200).json({results:categories.length, paginationResult, data: categories });
});


// @desc   Get a specific category
// @route  GET /api/v1/categories/:id
// @access Public
exports.getCategory = asyncHandler( async (req,res , next)=> {
const { id } = req.params;
const category = await CategoryModel.findById(id);
if(!category){
return next(new ApiError(`Category not found with id of ${id}`, 404));
} 
res.status(200).json({data: category});
});

// @desc   Create a new category
// @route  POST /api/v1/categories
// @access Private
exports.createCategory =   asyncHandler(async  (req,res) => {
const { name } = req.body;
const category = await  CategoryModel.create({ name , slug : slugify(name)});
res.status(201).json({data: category})   
});

// @desc   Update a category
// @route  PUT /api/v1/categories/:id
// @access Private
exports.updateCategory = asyncHandler(async (req,res,next)=>{
const { id } = req.params;
const { name } = req.body;
const category = await CategoryModel.findOneAndUpdate({_id:id},{name , slug:slugify(name)} ,{new:true});
if(!category){
return next(new ApiError(`Category not found with id of ${id}`, 404));
}
res.status(200).json({data: category});
});

// @desc   Delete a category
// @route  DELETE /api/v1/categories/:id
// @access Private
exports.deleteCategory = factory.deleteOne(CategoryModel);