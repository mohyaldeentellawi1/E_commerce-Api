const SubCategoryModel = require('../models/subCategoryModel');
const factory = require('./handlersFactory');

//Middleware to set categoryId from params
exports.setCategoryIdFromParams = (req,res,next) => {
    // Nested Routes
    if(!req.body.category) req.body.category = req.params.categoryId;
    next();
};

// @desc   Create a new SubCategory
// @route  POST /api/v1/subCategories
// @access Private
exports.createSubCategory = factory.createOne(SubCategoryModel);
    
exports.createFilterObject = (req,res,next)=>{
    let filteredObject = {};
    if(req.params.categoryId) filteredObject = {category: req.params.categoryId};
    req.filteredObject = filteredObject;
    next();
};

// @desc   Get all SubCategories
// @route  GET /api/v1/subCategories
// @access Public
exports.getSubCategories = factory.getAll(SubCategoryModel);


// @desc   Get a specific SubCategory
// @route  GET /api/v1/subCategories/:id
// @access Public
exports.getSubCategory = factory.getOne(SubCategoryModel);


// @desc   Update a SubCategory
// @route  PUT /api/v1/subCategories/:id
// @access Private
exports.updateSubCategory = factory.updateOne(SubCategoryModel); 

// @desc   Delete a SubCategory
// @route  DELETE /api/v1/subCategories/:id
// @access Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);   