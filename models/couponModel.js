const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      required: [true, "Coupon name is required"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    expire: {
      type: Date,
      required: [true, "Coupon expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "Coupon discount is required"],
    },
  },
  { timestamps: true }
);

const CouponModel = mongoose.model("Coupon", couponSchema);

module.exports = CouponModel;
