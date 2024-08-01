const asyncHandler = require('express-async-handler');
const createToken = require('../middleware/creatTokenMiddleware');
const ApiError = require('..//utils/apiError');
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
