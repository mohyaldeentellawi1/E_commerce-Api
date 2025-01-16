const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const ApiError = require("../utils/apiError");
const createToken = require("../middleware/creatTokenMiddleware");
const factory = require("./handlersFactory");
const UserModel = require("../models/userModel");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

// @desc   Get all Users
// @route  GET /api/v1/users
// @access Private (Admin)
exports.getUsers = factory.getAll(UserModel, "User");

// @desc   Get a specific User
// @route  GET /api/v1/users/:id
// @access Private (Admin)
exports.getUser = factory.getOne(UserModel);

// @desc   Create a new User
// @route  POST /api/v1/users
// @access Private (Admin)
exports.createUser = factory.createOne(UserModel);

// @desc   Update a User Without Password
// @route  PUT /api/v1/users/:id
// @access Private (Admin)
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(
      new ApiError(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    message: "User Updated successfully",
    data: document,
  });
});

// @desc   Update a User Role
// @route  PUT /api/v1/users/updateRole/:id
// @access Private (Admin)
exports.updateRole = asyncHandler(async (req, res, next) => {
  const document = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(
      new ApiError(`User not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    message: "User Updated successfully",
    data: document,
  });
});

// @desc   Update a User Password
// @route  PUT /api/v1/users/updatePassword/:id
// @access Private (Admin)
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  if (!user) {
    return next(
      new ApiError(`user not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ data: user });
});

// @desc   Delete a User
// @route  DELETE /api/v1/users/:id
// @access Private (Admin)
exports.deleteUser = factory.deleteOne(UserModel);

//upload Profile image
exports.uploadUserImage = uploadSingleImage("profileImage");

//image processing
exports.imageProcessing = asyncHandler(async (req, res, next) => {
  const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${fileName}`);
    // Save the image name to the request body
    req.body.profileImage = fileName;
  }
  next();
});

// @desc Get a Loged User Data
// @route GET /api/v1/users/get-me
// @access Private (User)
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// @desc Update a Logged User Password
// @route PUT /api/v1/users/update-my-password
// @access Private (User)
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    { new: true }
  );
  const token = createToken(user._id);
  res.status(200).json({
    success: true,
    message: "Password Updated successfully",
    data: user,
    accessToken: token,
  });
});

// @desc Update a Logged User Data Without Password
// @route PUT /api/v1/users/update-me
// @access Private (User)
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      slug: req.body.slug,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.profileImage,
    },
    {
      new: true,
    }
  );
  const token = createToken(user._id);
  res.status(200).json({
    success: true,
    message: "User Updated successfully",
    data: user,
    accessToken: token,
  });
});
