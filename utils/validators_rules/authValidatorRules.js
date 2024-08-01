const { check } = require('express-validator');
const ApiError = require('../../utils/apiError');
const slugify = require('slugify');
const UserModel = require('../../models/userModel');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middleware/validatorMiddleware');

exports.registerValidator = [
    check('name').notEmpty().withMessage('User Name is required')
        .isString().withMessage('User Name should be a string')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email').notEmpty().withMessage('User Email is required').
        isEmail().withMessage('Invalid Email').
        custom((val) => UserModel.findOne({ email: val }).then((email) => {
            if (email) {
                return Promise.reject(
                    new ApiError('Email already exists', 400)
                );
            }
            return true;
        })),
    check('password').notEmpty().withMessage('User Password is required')
        .isLength({ min: 6 }).withMessage('Password should be at least 6 characters')
        .custom((pass, { req }) => {
            if (pass !== req.body.confirmPassword) {
                throw new ApiError('Passwords do not match', 400);
            }
            return true;
        }),
    check('confirmPassword').notEmpty().withMessage('Confirm Password is required'),
    validatorMiddleware,
];

exports.loginValidator = [
    check('email').notEmpty().withMessage('User Email is required').
        isEmail().withMessage('Invalid Email'),
    check('password').notEmpty().withMessage('User Password is required')
        .isLength({ min: 6 }).withMessage('Password should be at least 6 characters'),
    validatorMiddleware,
];