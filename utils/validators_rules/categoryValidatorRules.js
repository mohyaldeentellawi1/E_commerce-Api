const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const CategoryModel = require("../../models/categoryModel");
const ApiError = require("../apiError");

exports.createCategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Category Name is required")
    .isLength({ min: 3 })
    .withMessage("Category Name should be at least 3 characters")
    .isLength({ max: 50 })
    .withMessage("Category Name should be at most 50 characters")
    .isString()
    .withMessage("Category Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom((val) => {
      const category = CategoryModel.findOne({ name: val });
      if (category) {
        return Promise.reject(
          new ApiError("Category with this name already exists", 400)
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Category Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("Category Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
