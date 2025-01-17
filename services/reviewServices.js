const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const ReviewModel = require("../models/reviewModel");

//Middleware to set productId from params
// api/v1/products/:productId/reviews
// Nested Routes
exports.setProductIdAndUserIdFromParams = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id.toString();
  next();
};

exports.createFilterObject = (req, res, next) => {
  let filteredObject = {};
  if (req.params.productId) filteredObject = { product: req.params.productId };
  req.filterObj = filteredObject;
  next();
};

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
  await review.save(); // Trigger "save" event in ReviewModel
  res.status(200).json({
    success: true,
    message: "review Updated successfully",
    data: review,
  });
});

// @desc   Delete a Review
// @route  DELETE /api/v1/reviews/:id
// @access Private/Protect/User-Admin
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await ReviewModel.findByIdAndDelete(id);
  if (!review) {
    return next(new ApiError(`review not found with id of ${id}`, 404));
  }
  await review.deleteOne(); // Trigger "findOneAndDelete" event for reviewModel
  res
    .status(200)
    .json({ success: true, message: `This ${id} Deleted successfully` });
});
