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
exports.updateReview = factory.updateOne(ReviewModel);

// @desc   Delete a Review
// @route  DELETE /api/v1/reviews/:id
// @access Private/Protect/User-Admin
exports.deleteReview = factory.deleteOne(ReviewModel);
