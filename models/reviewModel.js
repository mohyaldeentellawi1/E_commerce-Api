const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
    },
    ratings: {
      type: Number,
      required: [true, "Review must have a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Review must belong to a user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must belong to a product"],
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImage",
  });
  next();
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
