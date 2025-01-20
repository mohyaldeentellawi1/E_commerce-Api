const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
// const ApiError = require("../apiError");

exports.createNewOrdeValidator = [
  check("cartId")
    .notEmpty()
    .withMessage("Please enter a cart id")
    .isMongoId()
    .withMessage("Invalid cart id"),
  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Please provide your address")
    .isString()
    .withMessage("Address must be a string"),
  check("shippingAddress.phone")
    .isMobilePhone(["tr-TR", "ar-SY"], { strictMode: true })
    .withMessage("Invalid phone number"),
  check("shippingAddress.city")
    .notEmpty()
    .withMessage("Please provide your city")
    .isString()
    .withMessage("City must be a string"),
  check("shippingAddress.postalCode")
    .optional()
    .isPostalCode("any", { strictMode: true })
    .withMessage("Invalid postal code"),
  validatorMiddleware,
];
