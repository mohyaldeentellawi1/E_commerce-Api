const asyncHandler = require("express-async-handler");

const UserModel = require("../models/userModel");

// @desc   Add Product to wishList
// @route  POST /api/v1/wishlist
// @access Private (User)
exports.addProductToWishList = asyncHandler(async (req, res, next) => {
  //addToSet => add productId to wishList if it is not existing
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: req.body.productId } },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Product added to wishList successfully",
    data: user.wishList,
  });
});

// @desc   Remove Product from wishList
// @route  DELETE /api/v1/wishlist/productId
// @access Private (User)
exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  //Pull => remove productId from wishList
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishList: req.params.productId } },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Product removed from wishList successfully",
    data: user.wishList,
  });
});

// @desc   Get logged user wishlist
// @route  GET /api/v1/wishlist
// @access Private (User)
exports.getLoggedUserWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishList");
  res.status(200).json({
    success: true,
    message: "User's wishlist fetched successfully",
    result: user.wishList.length,
    data: user.wishList,
  });
});
