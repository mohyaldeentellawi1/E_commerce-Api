const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const ProductModel = require("../models/productModel");
const CartModel = require("../models/cartModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalCartPrice = totalPrice;
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
