const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Name is required"],
    },
    slug: {
      type: String,
      lowerCase: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Too short password"],
    },
    passwordChangedAt: {
      type: Date,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: { type: String },
        details: { type: String },
        phone: { type: String, trim: true },
        city: { type: String },
        postalCode: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// For HashPassword
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// delete all reviews of specific User when the User is deleted then update ratingsAverage and ratingsQuantity of products in which the reviews are present
UserSchema.pre("findOneAndDelete", async function (next) {
  const userId = this.getQuery()._id;
  const ReviewModel = mongoose.model("Review");
  const reviews = await ReviewModel.find({ user: userId });
  await ReviewModel.deleteMany({ user: userId });
  const productIds = [...new Set(reviews.map((review) => review.product))];
  await Promise.all(
    productIds.map(async (productId) => {
      await ReviewModel.calcAvgRatingAndQuantity(productId);
    })
  );
  next();
});

// update , delete, get , getALL
UserSchema.post("init", (doc) => {
  if (doc.profileImage && !doc.profileImage.includes("http")) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
});

// create
UserSchema.post("save", (doc) => {
  if (doc.profileImage && !doc.profileImage.includes("http")) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
