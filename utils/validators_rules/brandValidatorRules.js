const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name is required")
    .isLength({ max: 50 })
    .withMessage("Brand Name should be at most 50 characters")
    .isLength({ min: 2 })
    .withMessage("Brand Name should be at least 2 characters")
    .isString()
    .withMessage("Brand Name should be a string"),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("Brand Name should be a string"),
  validatorMiddleware,
];

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleware,
];

exports.deleteBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  validatorMiddleware,
];
