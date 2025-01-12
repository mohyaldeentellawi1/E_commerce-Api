const { check } = require("express-validator");
const CategoryM = require("../../models/categoryModel");
const ApiError = require("../../utils/apiError").default;
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createSubcategoryValidator = [
  check("name")
    .notEmpty()
    .withMessage("Subcategory Name is required")
    .isLength({ min: 2 })
    .withMessage("Subcategory Name should be at least 2 characters")
    .isLength({ max: 50 })
    .withMessage("Subcategory Name should be at most 50 characters"),
  check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Category Id")
    .custom(async (categoryID) => {
      const category = await CategoryM.findById(categoryID);
      if (!category) {
        return Promise.reject(new ApiError("Category not found", 404));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("Subcategory Name should be a string"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category Id")
    .custom(async (categoryID) => {
      const category = await CategoryM.findById(categoryID);
      if (!category) {
        return Promise.reject(new ApiError("Category not found", 404));
      }
      return true;
    }),
  validatorMiddleware,
];

exports.getSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory Id"),
  validatorMiddleware,
];

exports.deleteSubcategoryValidator = [
  check("id").isMongoId().withMessage("Invalid Subcategory Id"),
  validatorMiddleware,
];
