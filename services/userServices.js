const UserModel = require('../models/userModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const ApiError = require('../utils/apiError');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { uploadSingleImage } = require('../middleware/uploadImageMiddleware');


// @desc   Get all Users
// @route  GET /api/v1/users
// @access Private (Admin)
exports.getUsers = factory.getAll(UserModel);


// @desc   Get a specific User
// @route  GET /api/v1/users/:id
// @access Private (Admin , User)
exports.getUser = factory.getOne(UserModel);

// @desc   Create a new User
// @route  POST /api/v1/users
// @access Private (Admin , User)
exports.createUser = factory.createOne(UserModel);

// @desc   Update a User
// @route  PUT /api/v1/users/:id
// @access Private (Admin , User)
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await UserModel.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
        role: req.body.role,
        active: req.body.active,
    },
        { new: true });
    if (!document) {
        return next(new ApiError(`document not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ data: document });
});

// @desc   Update a User Password
// @route  PUT /api/v1/users/updatePassword/:id
// @access Private (Admin , User)
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findByIdAndUpdate(req.params.id,
        { password: await bcrypt.hash(req.body.password, 10) },
        { new: true });
        if(!user){
            return next(new ApiError(`user not found with id of ${req.params.id}`, 404));
        }
        res.status(200).json({ data: user });
});

// @desc   Delete a User
// @route  DELETE /api/v1/users/:id
// @access Private (Admin, User)
exports.deleteUser = factory.deleteOne(UserModel);

//upload Profile image
exports.uploadUserImage = uploadSingleImage('profileImage');

//image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`);
        // Save the image name to the request body
        req.body.profileImage = fileName;
    }
    next();
});