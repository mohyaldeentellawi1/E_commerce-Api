const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const ProductModel = require("../models/productModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");
const UserModel = require("../models/userModel");

// @desc   Create Order
// @route  POST /api/v1/orders/:cartId
// @access Private (User)
exports.createNewOrder = asyncHandler(async (req, res, next) => {
  // App Settings By Admin (Admin Can Update this values if he wants)
  const taxPrice = 0;
  const shippingPrice = 0;

  const cart = await CartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  const order = await OrderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: totalOrderPrice,
  });
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await ProductModel.bulkWrite(bulkOptions, {});
    await CartModel.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({
    status: true,
    message: "Order created successfully",
    data: order,
  });
});

exports.filterOrdersForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});

// @desc   Get Logged User Orders
// @route  GET /api/v1/orders
// @access Private (User and Admin)
exports.getOrders = factory.getAll(OrderModel, "Order");

// @desc   Get Specific Order
// @route  GET /api/v1/orders/:orderId
// @access Private (User and Admin)
exports.getOrder = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  const order = await OrderModel.findById(req.params.id);
  if (!order) {
    return next(new ApiError("Order not found", 404));
  }
  if (
    user.role === "admin" ||
    (user.role === "user" && order.user._id.toString() === user._id.toString())
  ) {
    res.status(200).json({
      status: true,
      message: "Order fetched successfully",
      data: order,
    });
  } else {
    return next(new ApiError("Unauthorized to view this order", 403));
  }
});
