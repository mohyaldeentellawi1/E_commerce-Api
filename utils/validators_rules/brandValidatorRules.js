const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const BrandModel = require("../../models/brandsModel");
const ApiError = require("../apiError");

exports.createBrandValidator = [
  check("name")
    .notEmpty()
    .withMessage("Brand Name is required")
    .isLength({ max: 50 })
    .withMessage("Brand Name should be at most 50 characters")
    .isLength({ min: 2 })
    .withMessage("Brand Name should be at least 2 characters")
    .isString()
    .withMessage("Brand Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    })
    .custom(async (val) =>
      BrandModel.findOne({ name: val }).then((brand) => {
        if (brand) {
          return Promise.reject(new ApiError("Brand already exists", 400));
        }
        return true;
      })
    ),
  validatorMiddleware,
];

exports.updateBrandValidator = [
  check("id").isMongoId().withMessage("Invalid Brand Id"),
  check("name")
    .optional()
    .isString()
    .withMessage("Brand Name should be a string")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
