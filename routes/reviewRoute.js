const express = require("express");
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require("../services/reviewServices");
const { protect, allowTo } = require("../services/authServices");
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators_rules/reviewValidatorRules");

const router = express.Router();

router
  .route("/")
  .get(getReviews)
  .post(protect, allowTo("user"), createReviewValidator, createReview);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(protect, allowTo("user"), updateReviewValidator, updateReview)
  .delete(
    protect,
    allowTo("admin", "user"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
