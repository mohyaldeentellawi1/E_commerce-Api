const mongoose = require("mongoose");

// Create a Brand Schema
const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      trim: true,
      unique: [true, "Brand name must be unique"],
      maxlength: [50, "Brand name must not exceed 50 characters"],
      minlenght: [2, "Brand name must be at least 2 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// update , delete, get , getALL
BrandSchema.post("init", (doc) => {
  if (doc.image && !doc.image.includes("http")) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});

// create
BrandSchema.post("save", (doc) => {
  if (doc.image && !doc.image.includes("http")) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
});

// Create a Model
const BrandModel = mongoose.model("Brand", BrandSchema);

module.exports = BrandModel;
