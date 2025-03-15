const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../apiError");
const ProductModel = require("../../models/productModel");

exports.addToCartValidator = [
  check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID")
    .custom(async (productId, { req }) => {
      const product = await ProductModel.findById(productId);
      if (!product) {
        return Promise.reject(new ApiError("Product not found", 404));
      }
      return true;
    }),
  check("color").custom(async (val, { req }) => {
    const { productId } = req.body;
    const product = await ProductModel.findById(productId);
    if (product.colors.length > 0 && val === "") {
      return Promise.reject(new ApiError("Color is required", 403));
    }
    if (product.colors.length > 0 && !product.colors.includes(val)) {
      return Promise.reject(new ApiError(`Color ${val} is not available`, 403));
    }
    return true;
  }),
  validatorMiddleware,
];

exports.updateQuantityForItemValidator = [
  check("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Invalid Item ID"),
  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .isInt({ min: 1 })
    .withMessage("Invalid quantity"),
  validatorMiddleware,
];

exports.removeItemFromCartValidator = [
  check("itemId")
    .notEmpty()
    .withMessage("Item ID is required")
    .isMongoId()
    .withMessage("Invalid Item ID"),
  validatorMiddleware,
];
