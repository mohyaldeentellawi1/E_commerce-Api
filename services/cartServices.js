const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const ProductModel = require("../models/productModel");
const CouponModel = require("../models/couponModel");
const CartModel = require("../models/cartModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @desc   add product to cart
// @route  POST /api/v1/cart
// @access Private (User)
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);
  if (product.quantity === 0) {
    return next(new ApiError("Product is out of stock", 400));
  }
  let cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
          totalItemPrice: product.price,
        },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cartItem.totalItemPrice = cartItem.price * cartItem.quantity;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        price: product.price,
        totalItemPrice: product.price,
      });
    }
  }

  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    data: cart,
  });
});

// @desc   gte logged user cart
// @route  GET /api/v1/cart
// @access Private (User)
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found for this user", 404));
  }
  res.status(200).json({
    success: true,
    message: "Cart retrieved successfully",
    data: cart,
  });
});

// @desc   Remove Product from User Cart
// @route  DELETE /api/v1/cart/:itemId
// @access Private (User)
exports.removeItemFromCart = asyncHandler(async (req, res, next) => {
  //Pull => remove itemId from User Cart
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) {
    return next(new ApiError("Cart not found for this user", 404));
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
});

// @desc   Clear User Cart
// @route  DELETE /api/v1/cart/
// @access Private (User)
exports.clearUserCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });
  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});

// @desc   Update Quantity For Specific Product Item in Cart
// @route  PUT /api/v1/cart/:itemId
// @access Private (User)
exports.updateQuantityForItem = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found for this user", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cartItem.totalItemPrice = cartItem.price * quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError("Item not found in cart", 404));
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

// @desc   Apply Coupon on logged user Cart
// @route  PUT /api/v1/cart/applyCoupon
// @access Private (User)
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await CouponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("Invalid Coupon or Coupon Expired", 400));
  }
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("Cart not found for this user", 404));
  }
  const totalPrice = cart.totalCartPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: cart,
  });
});
