const mongoose = require("mongoose");
const ProductModel = require("./productModel");

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

reviewSchema.statics.calcAvgRatingAndQuantity = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$ratings" },
        ratingQuantity: { $sum: 1 },
      },
    },
  ]);
  if (result.length > 0) {
    await ProductModel.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: result[0].avgRating,
        ratingsQuantity: result[0].ratingQuantity,
      },
      { new: true }
    );
  } else {
    await ProductModel.findByIdAndUpdate(
      productId,
      {
        ratingsAverage: 0,
        ratingsQuantity: 0,
      },
      { new: true }
    );
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAvgRatingAndQuantity(this.product);
});

reviewSchema.post("findOneAndDelete", async (doc) => {
  if (doc) {
    await doc.constructor.calcAvgRatingAndQuantity(doc.product);
  }
});

const reviewModel = mongoose.model("Review", reviewSchema);

module.exports = reviewModel;
