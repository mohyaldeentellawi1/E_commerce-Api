const { check } = require("express-validator");
const ReviewModel = require("../../models/reviewModel");
const ApiError = require("../apiError");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.createReviewValidator = [
  check("content")
    .optional()
    .isString()
    .withMessage("Please enter a valid review content"),
  check("ratings")
    .notEmpty()
    .withMessage("Please enter a valid review rating")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Please enter a valid review rating"),
  check("user")
    .isMongoId()
    .withMessage("Invalid User Id")
    .custom((userId, { req }) => {
      const userFromToken = req.user._id.toString();
      if (userId !== userFromToken) {
        return Promise.reject(
          new ApiError("You can't review another user", 403)
        );
      }
      return true;
    }),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product Id")
    .custom(async (productId, { req }) => {
      const review = await ReviewModel.findOne({
        user: req.user._id,
        product: productId,
      });
      if (review) {
        return Promise.reject(
          new ApiError("You have already reviewed this product", 400)
        );
      }
      return true;
    }),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id")
    .custom(async (reviewId, { req }) => {
      const review = await ReviewModel.findById(reviewId);
      if (!review) {
        return Promise.reject(new ApiError("Review not found", 404));
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        return Promise.reject(
          new ApiError("You are not authorized to update this review", 403)
        );
      }
      return true;
    }),
  check("content")
    .optional()
    .isString()
    .withMessage("Please enter a valid review content"),
  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Please enter a valid review rating"),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review Id"),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review Id")
    .custom(async (reviewId, { req }) => {
      if (req.user.role === "user") {
        const review = await ReviewModel.findById(reviewId);
        if (!review) {
          return Promise.reject(new ApiError("Review not found", 404));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new ApiError("You are not authorized to Delete this review", 403)
          );
        }
      }
      return true;
    }),
  validatorMiddleware,
];
