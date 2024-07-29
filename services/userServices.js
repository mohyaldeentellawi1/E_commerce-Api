const UserModel = require('../models/userModel');
const factory = require('./handlersFactory');
const asyncHandler = require('express-async-handler');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const {uploadSingleImage} = require('../middleware/uploadImageMiddleware');


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
exports.createUser =  factory.createOne(UserModel);

// @desc   Update a User
// @route  PUT /api/v1/users/:id
// @access Private (Admin , User)
exports.updateUser = factory.updateOne(UserModel);

// @desc   Delete a User
// @route  DELETE /api/v1/users/:id
// @access Private (Admin, User)
exports.deleteUser = factory.deleteOne(UserModel);

//upload Profile image
exports.uploadUserImage = uploadSingleImage('profileImage');

//image processing
exports.imageProcessing = asyncHandler( async (req, res, next) => {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
    // Save the image name to the request body
    req.body.profileImage = fileName;
    next();
});