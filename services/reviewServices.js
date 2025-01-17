const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const ReviewModel = require("../models/reviewModel");

// @desc   Get all Reviews
// @route  GET /api/v1/reviews
// @access Public
exports.getReviews = factory.getAll(ReviewModel, "Review");

// @desc   Get a specific Review
// @route  GET /api/v1/reviews/:id
// @access Public
exports.getReview = factory.getOne(ReviewModel);

// @desc   Create a new Review
// @route  POST /api/v1/reviews
// @access Private/Protect/User
exports.createReview = factory.createOne(ReviewModel);

// @desc   Update a Review
// @route  PUT /api/v1/reviews/:id
// @access Private/Protect/User
exports.updateReview = asyncHandler(async (req, res, next) => {
  const review = await ReviewModel.findByIdAndUpdate(
    req.params.id,
    {
      content: req.body.content,
      ratings: req.body.ratings,
    },
    {
      new: true,
    }
  );
  if (!review) {
    return next(
      new ApiError(`review not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    message: "review Updated successfully",
    data: review,
  });
});

// @desc   Delete a Review
// @route  DELETE /api/v1/reviews/:id
// @access Private/Protect/User-Admin
exports.deleteReview = factory.deleteOne(ReviewModel);
