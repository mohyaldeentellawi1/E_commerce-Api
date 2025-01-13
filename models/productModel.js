const mongoose = require("mongoose");

// Create a Product Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      maxlength: [100, "Product title must not exceed 100 characters"],
      minlength: [5, "Product title must be at least 5 characters"],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Product description must be at least 20 characters"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
    },
    priceAfterDiscount: {
      type: Number,
      trim: true,
      default: 0,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating must not exceed 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.pre(/^find/, function (next) {
  this.populate([
    {
      path: "category",
      select: "name",
    },
    {
      path: "subcategories",
      select: "name",
    },
    {
      path: "brand",
      select: "name",
    },
  ]);
  next();
});

// update , delete, get , getALL
productSchema.post("init", (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagelist = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imagelist.push(imageUrl);
    });
    doc.images = imagelist;
  }
});

// create
productSchema.post("save", (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imageList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      imageList.push(imageUrl);
    });
    doc.images = imageList;
  }
});

const ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;
