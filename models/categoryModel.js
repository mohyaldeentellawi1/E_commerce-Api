const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
// Create a Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: [true, "Category name must be unique"],
      maxlength: [50, "Category name must not exceed 50 characters"],
      minlenght: [4, "Category name must be at least 3 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });

// update , delete, get , getALL
categorySchema.post("init", (doc) => {
  if (doc.image && !doc.image.includes("http")) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});

// create
categorySchema.post("save", (doc) => {
  if (doc.image && !doc.image.includes("http")) {
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
});

// delete all subCategories childs when category is deleted
asyncHandler(
  categorySchema.pre("findOneAndDelete", async function (next) {
    const categoryId = this.getQuery()._id;
    await mongoose.model("SubCategory").deleteMany({ category: categoryId });
    next();
  })
);

// delete all products childs when category is deleted
categorySchema.pre("findOneAndDelete", async function (next) {
  const categoryId = this.getQuery()._id;
  await mongoose.model("Product").deleteMany({ category: categoryId });
  next();
});

// Create a Model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
