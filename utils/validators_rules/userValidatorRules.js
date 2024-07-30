const { check  } = require('express-validator'); 
const UserModel = require('../../models/userModel');
const ApiError = require('../../utils/apiError');
const slugify = require('slugify');
const validatorMiddleware = require('../../middleware/validatorMiddleware');



exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User Id'),
    validatorMiddleware,
];

exports.createUserValidator = [
    check('name').notEmpty().withMessage('User Name is required')
    .isString().withMessage('User Name should be a string')
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('User Email is required').
    isEmail().withMessage('Invalid Email').
    custom((val)=> UserModel.findOne({email:val}).then((email)=>{
        if(email){
            return Promise.reject(
                new ApiError('Email already exists', 400)
            );
        }
        return true;
    })),
    check('password').notEmpty().withMessage('User Password is required')
    .isLength({min:6}).withMessage('Password should be at least 6 characters')
    .custom((pass,{req})=>{
        if(pass !== req.body.confirmPassword){
            throw new ApiError('Passwords do not match', 400);
        }
        return true;
    }),
    check('confirmPassword').notEmpty().withMessage('Confirm Password is required'),
    check('phone').optional()
    .isMobilePhone("tr-TR").withMessage('Invalid Phone Number')
    .custom((val)=> {
        const phoneStr = String(val);
        const phoneWithCountryCode = phoneStr.startsWith('+90') ? phoneStr : '+90' + phoneStr;
        const phoneWithLeadingZero = phoneStr.startsWith('0') ? phoneStr : '0' + phoneStr;
        const phoneWithoutLeadingZero = phoneStr.startsWith('0') ? phoneStr.slice(1) : phoneStr;
        return UserModel.findOne({
            $or: [
                { phone: phoneWithCountryCode },
                { phone: phoneWithLeadingZero },
                { phone: phoneWithoutLeadingZero }
            ]
        }).then((phone)=>{
            if(phone){
                return Promise.reject(
                    new ApiError('Phone Number already exists', 400)
                );
            }
            return true;
    });
    }),
    check('profileImage').optional(),
    validatorMiddleware,
];

exports.updateUserValidator = [   
    check('id').isMongoId().withMessage('Invalid User Id'),
    check('name').optional()
    .isString().withMessage('User Name should be a string')
    .custom((val , {req})=>{
        req.body.slug = slugify(val);
        return true;
    }),
    check('email').optional()
    .isEmail().withMessage('Invalid Email'),
    check('password').optional()
    .isLength({min:6}).withMessage('Password should be at least 6 characters'),
    check('phone').optional()
    .isMobilePhone("tr-TR").withMessage('Invalid Phone Number')
    .custom((val)=> UserModel.findOne({phone:val}).then((phone)=>{
        if(phone){
            return Promise.reject(
                new ApiError('Phone Number already exists', 400)
            );
        }
        return true
    })),
    check('profileImage').optional(),
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User Id'),
    validatorMiddleware,
];