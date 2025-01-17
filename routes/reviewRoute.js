const express = require("express");
const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  createFilterObject,
  setProductIdAndUserIdFromParams: setProductIdFromParams,
} = require("../services/reviewServices");
const { protect, allowTo } = require("../services/authServices");
const {
  getReviewValidator,
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators_rules/reviewValidatorRules");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObject, getReviews)
  .post(
    protect,
    allowTo("user"),
    setProductIdFromParams,
    createReviewValidator,
    createReview
  );
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
