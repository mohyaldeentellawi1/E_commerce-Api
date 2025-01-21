const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const createToken = require("../middleware/creatTokenMiddleware");
const ApiError = require("../utils/apiError");
const sendEmail = require("../utils/sendEmail");

const UserModel = require("../models/userModel");

// @desc  Register a User
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res) => {
  const user = await UserModel.create({
    name: req.body.name,
    slug: req.body.slug,
    email: req.body.email,
    password: req.body.password,
  });
  user.password = undefined;
  user.wishList = undefined;
  user.addresses = undefined;
  user.otpVerified = undefined;
  const token = createToken(user._id);
  res.status(201).json({
    success: true,
    message: "User Registered Successfully",
    data: user,
    accessToken: token,
  });
});

// @desc  Login a User
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("Incorrect Email or Password", 401));
  }
  const isCorrectPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!user || !isCorrectPassword) {
    return next(new ApiError("Incorrect Email or Password", 401));
  }
  if (!user.active) {
    user.active = true;
    await user.save();
  }
  user.password = undefined;
  user.wishList = undefined;
  user.addresses = undefined;
  user.otpVerified = undefined;
  const token = createToken(user._id);
  res.status(200).json({
    success: true,
    message: "User Logged In Successfully",
    data: user,
    accessToken: token,
  });
});

// @desc  Protect Routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("Not Authorized to access this route", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded.userId);
  if (!user) {
    return next(new ApiError("No user found with this id", 404));
  }
  if (user.passwordChangedAt) {
    const changedPasswordTimeStamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (changedPasswordTimeStamp > decoded.iat) {
      return next(
        new ApiError("Password has been changed. Please login again", 401)
      );
    }
    if (!user.active) {
      return next(new ApiError("User is deactivated", 401));
    }
  }
  req.user = user;
  next();
});

// @desc  Grant Access to specific roles
exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const isAuthenticatedUser = roles.includes(req.user.role);
    if (!isAuthenticatedUser) {
      return next(
        new ApiError("You are not allowed to access this route", 403)
      );
    }
    next();
  });

// @desc  Forget Password
// @route POST /api/v1/auth/forget-password
// @access Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email", 404));
  }
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedCode = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.otp = hashedCode; // hashed code is stored in the database
  user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  user.otpVerified = false; // set to true when the user verifies the code
  await user.save();
  const message = `Hi ${user.name},\n We have received a request to reset your password. Please use the following code to reset your password:\n ${resetCode}\n`;

  try {
    await sendEmail({
      from: "no-reply@demomailtrap",
      to: user.email,
      subject: "Password Reset Code",
      text: message,
      html: message,
    });
  } catch (error) {
    user.otp = undefined;
    user.otpExpires = undefined;
    user.otpVerified = undefined;
    await user.save();
    return next(new ApiError("Email could not be sent", 500));
  }
  res.status(200).json({
    success: true,
    message: "Code sent to your email",
  });
});

exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.otp)
    .digest("hex");
  const user = await UserModel.findOne({
    otp: hashedCode,
    otpExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ApiError("Invalid or expired code", 400));
  }
  user.otpVerified = true;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Code verified successfully",
  });
});

// @desc  Reset Password
// @route POST /api/v1/auth/reset-password
// @access Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email", 404));
  }
  if (!user.otpVerified) {
    return next(new ApiError("Please verify your code first", 400));
  }
  user.password = req.body.newPassword;
  user.otp = undefined;
  user.otpExpires = undefined;
  user.otpVerified = undefined;
  await user.save();
  const token = createToken(user._id);
  res.status(200).json({
    success: true,
    message: "Password reset successfully",
    accessToken: token,
  });
});
