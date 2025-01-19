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
  check("color")
    .notEmpty()
    .withMessage("Color is required")
    .custom(async (val, { req }) => {
      const { productId } = req.body;
      const product = await ProductModel.findById(productId);
      if (!product.colors.includes(val)) {
        return Promise.reject(
          new ApiError(`Color ${val} is not available`, 403)
        );
      }
      return true;
    }),
  validatorMiddleware,
];
