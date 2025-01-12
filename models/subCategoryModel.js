const mongoose = require("mongoose");

// Create a SubCategory Schema
const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "SubCategory name is required"],
      trim: true,
      unique: [true, "SubCategory name must be unique"],
      maxlength: [50, "SubCategory name must not exceed 50 characters"],
      minlenght: [2, "SubCategory name must be at least 2 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "SubCategory must belong to a Category"],
    },
  },
  { timestamps: true }
);

subCategorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

// Create a Model
const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategoryModel;
