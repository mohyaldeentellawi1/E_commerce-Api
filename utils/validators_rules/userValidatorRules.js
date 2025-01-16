const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const UserModel = require("../../models/userModel");
const ApiError = require("../apiError");

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User Name is required")
    .isString()
    .withMessage("User Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .notEmpty()
    .withMessage("User Email is required")
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom(async (val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("Email already exists", 400));
        }
        return true;
      })
    ),
  check("password")
    .notEmpty()
    .withMessage("User Password is required")
    .isLength({ min: 6 })
    .withMessage("Password should be at least 6 characters")
    .custom((pass, { req }) => {
      if (pass !== req.body.confirmPassword) {
        return Promise.reject(new ApiError("Passwords do not match", 400));
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR", "ar-SY"], { strictMode: true })
    .withMessage("Invalid Phone Number for this country"),
  check("profileImage").optional(),
  validatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("User Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom(async (val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("Email already exists", 400));
        }
        return true;
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR", "ar-SY"], { strictMode: true })
    .withMessage("Invalid Phone Number for this country"),
  check("profileImage").optional(),
  validatorMiddleware,
];

exports.updatePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
  check("password")
    .notEmpty()
    .withMessage("New Password is required")
    .custom(async (newPass, { req }) => {
      const user = await UserModel.findById(req.params.id);
      if (!user) {
        return Promise.reject(
          new ApiError(`User not found with id of ${req.params.id}`, 404)
        );
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        return Promise.reject(
          new ApiError("Current Password is incorrect", 400)
        );
      }
      if (newPass !== req.body.confirmPassword) {
        return Promise.reject(new ApiError("Passwords do not match", 400));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User Id"),
  validatorMiddleware,
];

exports.updateLoggedUserValidator = [
  check("name")
    .optional()
    .isString()
    .withMessage("User Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid Email Format")
    .custom(async (val) =>
      UserModel.findOne({ email: val }).then((user) => {
        if (user) {
          return Promise.reject(new ApiError("Email already exists", 400));
        }
        return true;
      })
    ),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR", "ar-SY"], { strictMode: true })
    .withMessage("Invalid Phone Number for this country"),
  check("profileImage").optional(),
  validatorMiddleware,
];

exports.updateLoggedUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required"),
  check("password")
    .notEmpty()
    .withMessage("New Password is required")
    .custom(async (newPass, { req }) => {
      const user = await UserModel.findById(req.user._id);
      if (!user) {
        return Promise.reject(
          new ApiError(`User not found with id of ${req.user._id}`, 404)
        );
      }
      const isCorrectPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
      );
      if (!isCorrectPassword) {
        return Promise.reject(
          new ApiError("Current Password is incorrect", 400)
        );
      }
      if (newPass !== req.body.confirmPassword) {
        return Promise.reject(new ApiError("Passwords do not match", 400));
      }
      return true;
    }),
  validatorMiddleware,
];
