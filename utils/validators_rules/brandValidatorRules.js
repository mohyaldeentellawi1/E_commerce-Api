const { check  } = require('express-validator'); 
const BrandModel = require('../../models/brandsModel');
const ApiError = require('../../utils/apiError');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand Id'),
    validatorMiddleware,
];

exports.createBrandValidator = [
    check('name').notEmpty().withMessage('Brand Name is required')
    .isLength({ max: 50 }).withMessage('Brand Name should be at most 50 characters')
    .isString().withMessage('Brand Name should be a string')
    .custom((name) => BrandModel.findOne({ name }).then((brand)=>{
        if(brand){
        return Promise.reject(
            new ApiError('Name already exists', 400)
        );
        }
        return true;
    })),
    validatorMiddleware,
];

exports.updateBrandValidator = [   
    check('id').isMongoId().withMessage('Invalid Brand Id'),
    check('name').notEmpty().withMessage('Brand Name is required')
    .isString().withMessage('Brand Name should be a string')
    .custom((name)=>BrandModel.findOne({name}).then((name)=>{
        if(name) {
        return Promise.reject(
            new ApiError('Name already exists', 400)
        );
        }
        return true;
    })),
    validatorMiddleware,
];

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand Id'),
    validatorMiddleware,
];