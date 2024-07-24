const { check  } = require('express-validator'); 
const SubCategoryModel = require('../../models/subCategoryModel');
const ApiError = require('../../utils/apiError');
const slugify = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');


exports.getSubcategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory Id'),
    validatorMiddleware,
];

exports.createSubcategoryValidator = [
    check('name').notEmpty().withMessage('Subcategory Name is required')
    .isLength({ min: 2 }).withMessage('Subcategory Name should be at least 2 characters')
    .isLength({ max: 50 }).withMessage('Subcategory Name should be at most 50 characters').
    custom((name , {req})=> SubCategoryModel.findOne({ name, category: req.body.category }).then((subCategory)=>{
        if(subCategory){
            return Promise.reject(new ApiError('Name already exists in this category', 400));
        }
        return true
    }))
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('category').notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid Category Id')
    ,
    validatorMiddleware,
];

exports.updateSubcategoryValidator = [   
    check('id').isMongoId().withMessage('Invalid Subcategory Id'),
    check('name').notEmpty().withMessage('Subcategory Name is required')
    .isString().withMessage('Subcategory Name should be a string')
    .custom((name, {req})=> SubCategoryModel.findOne({name, category:req.body.category}).then((subCategory)=>{
        if(subCategory) {
            return Promise.reject(new ApiError('Name already exists in this category', 400));
        }
        return true;
    })).
    custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('category').notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid Category Id'),
    validatorMiddleware,
];

exports.deleteSubcategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory Id')
    .notEmpty().withMessage('Subcategory Id is required'),
    validatorMiddleware,
];