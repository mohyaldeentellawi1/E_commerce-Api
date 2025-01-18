const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../apiError");
const CouponModel = require("../../models/couponModel");

exports.createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isString()
    .withMessage("Coupon name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom(async (couponName, { req }) => {
      const existingCoupon = await CouponModel.findOne({ name: couponName });
      if (existingCoupon) {
        return Promise.reject(new ApiError("Coupon already exists", 400));
      }
      return true;
    }),
  check("expire")
    .notEmpty()
    .withMessage("Coupon expire date is required")
    .isDate()
    .withMessage("Invalid date format"),
  check("discount")
    .notEmpty()
    .withMessage("Coupon discount is required")
    .isNumeric()
    .withMessage("Coupon discount should be a number"),
  validatorMiddleware,
];

exports.updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("Coupon name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom(async (couponName, { req }) => {
      const existingCoupon = await CouponModel.findOne({ name: couponName });
      if (existingCoupon) {
        return Promise.reject(new ApiError("Coupon already exists", 400));
      }
      return true;
    }),
  check("expire").optional().isDate().withMessage("Invalid date format"),
  check("discount")
    .optional()
    .isNumeric()
    .withMessage("Coupon discount should be a number"),
  validatorMiddleware,
];

exports.getCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  validatorMiddleware,
];

exports.deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid Coupon Id"),
  validatorMiddleware,
];
