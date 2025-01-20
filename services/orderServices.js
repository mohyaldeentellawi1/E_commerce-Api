const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const ProductModel = require("../models/productModel");
const CartModel = require("../models/cartModel");
const OrderModel = require("../models/orderModel");

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
