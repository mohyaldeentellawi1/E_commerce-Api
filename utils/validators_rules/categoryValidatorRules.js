const { check  } = require('express-validator'); 
const CategoryModel = require('../../models/categoryModel');
const ApiError = require('../../utils/apiError');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id'),
    validatorMiddleware,
];

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category Name is required')
    .isLength({ min: 3 }).withMessage('Category Name should be at least 3 characters')
    .isLength({ max: 50 }).withMessage('Category Name should be at most 50 characters')
    .isString().withMessage('Category Name should be a string')
    .custom((name) => CategoryModel.findOne({ name }).then((name)=>{
        if(name){
        return Promise.reject(
            new ApiError('Name already exists', 400)
        );
        }
        return true;
    })),
    validatorMiddleware,
];

exports.updateCategoryValidator = [   
    check('id').isMongoId().withMessage('Invalid Category Id'),
    check('name').notEmpty().withMessage('Category Name is required')
    .isString().withMessage('Category Name should be a string')
    .custom(
        (name) => CategoryModel.findOne({ name }).then((name)=>{
            if(name){
            return Promise.reject(
                new ApiError('Name already exists', 400)
            );
            }
            return true;
        })),
    validatorMiddleware,
];

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Category Id'),
    validatorMiddleware,
];