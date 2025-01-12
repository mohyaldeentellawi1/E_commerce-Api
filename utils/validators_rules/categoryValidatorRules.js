const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 3 })
    .withMessage("Category Name should be at least 3 characters")
    .isLength({ max: 50 })
    .withMessage("Category Name should be at most 50 characters")
    .isString()
    .withMessage("Category Name should be a string"),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("Category Name should be a string"),
  validatorMiddleware,
];

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleware,
];

exports.deleteCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  validatorMiddleware,
];
