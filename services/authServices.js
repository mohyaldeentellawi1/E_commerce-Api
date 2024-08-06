const asyncHandler = require('express-async-handler');
const createToken = require('../middleware/creatTokenMiddleware');
const ApiError = require('..//utils/apiError');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');



// @desc  Register a User 
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
    const user = await UserModel.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    const token = createToken(user._id);
    res.status(201).json({ data: user, token });
});


// @desc  Login a User
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError('Invalid Email or Password', 401));
    }
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
});

// @desc  Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError('Not Authorized to access this route', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
        return next(new ApiError('No user found with this id', 404));
    }
    if (user.passwordChangedAt) {
        const changedPasswordTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);
        if (changedPasswordTime > decoded.iat) {
            return next(new ApiError('Password has been changed. Please login again', 401));
        }
    }
    req.user = user;
    next();
});


// @desc  Grant Access to specific roles
exports.allowTo = (...roles) => asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return next(new ApiError('You are not allowed to access this route', 403));
    }
    next();
});