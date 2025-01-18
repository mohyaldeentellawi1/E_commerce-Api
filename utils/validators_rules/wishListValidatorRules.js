const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../apiError");
const UserModel = require("../../models/userModel");

exports.addProductToWishListValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .notEmpty()
    .withMessage("Product Id is required")
    .isString()
    .withMessage("Product Id should be a string"),
  validatorMiddleware,
];

exports.removeProductFromWishListValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .notEmpty()
    .withMessage("Product Id is required")
    .isString()
    .withMessage("Product Id should be a string")
    .custom(async (productId, { req }) => {
      const user = await UserModel.findById(req.user._id);
      if (!user.wishList.includes(productId)) {
        return Promise.reject(
          new ApiError("Product is not in your wishlist", 400)
        );
      }
      return true;
    }),
  validatorMiddleware,
];
