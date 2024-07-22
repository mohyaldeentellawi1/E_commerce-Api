const SubCategoryModel = require('../models/subCategoryModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

//Middleware to set categoryId from params
exports.setCategoryIdFromParams = (req,res,next) => {
    // Nested Routes
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
};

// @desc   Create a new SubCategory
// @route  POST /api/v1/subCategories
// @access Private
exports.createSubCategory =   asyncHandler(async  (req,res) => {
    const { name , category} = req.body;
    const subCategory = await  SubCategoryModel.create({ name , slug : slugify(name), category: category});
    res.status(201).json({data: subCategory});  
    });
    
exports.createFilterObject = (req,res,next)=>{
    let filteredObject = {};
    if(req.params.categoryId) filteredObject = {category: req.params.categoryId};
    req.filteredObject = filteredObject;
    next();
};

// @desc   Get all SubCategories
// @route  GET /api/v1/subCategories
// @access Public
exports.getSubCategories = asyncHandler( async (req,res) => {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 50;
    const skip = (page - 1) * limit;    
    const subCategories = await SubCategoryModel.find(req.filteredObject ).skip(skip).limit(limit).populate({ path:'category', select : 'name'});
    res.status(200).json({results:subCategories.length, page, data: subCategories});
    });
    
    
    // @desc   Get a specific SubCategory
    // @route  GET /api/v1/subCategories/:id
    // @access Public
    exports.getSubCategory = asyncHandler( async (req,res , next)=> {
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findById(id).populate({ path:'category', select : 'name'});
    if(!subCategory){
    return next(new ApiError(`SubCategory not found with id of ${id}`, 404));
    } 
    res.status(200).json({data: subCategory});
    });   
    
// @desc   Update a SubCategory
// @route  PUT /api/v1/subCategories/:id
// @access Private
exports.updateSubCategory = asyncHandler(async (req,res,next)=>{
    const { id } = req.params;
    const { name , category } = req.body;
    const subCategory = await SubCategoryModel.findOneAndUpdate({_id:id},{name , slug:slugify(name), category} ,
    {new:true}); 
    if(!subCategory){
    return next(new ApiError(`SubCategory not found with id of ${id}`, 404));
    }
    res.status(200).json({data: subCategory});
    });    

// @desc   Delete a SubCategory
// @route  DELETE /api/v1/subCategories/:id
// @access Private
exports.deleteSubCategory = asyncHandler( async (req,res, next)=>{
    const { id } = req.params;
    const subCategory = await SubCategoryModel.findByIdAndDelete(id);
    if(!subCategory){
    return next(new ApiError(`SubCategory not found with id of ${id}`, 404));
    }
    res.status(204).send();
    });    