const CouponModel = require("../models/couponModel");
const factory = require("./handlersFactory");

// @desc   Get all Coupons
// @route  GET /api/v1/coupons
// @access Private(Admin)
exports.getCoupons = factory.getAll(CouponModel, "Coupon");

// @desc   Get a specific Coupon
// @route  GET /api/v1/coupons/:id
// @access Private(Admin)
exports.getCoupon = factory.getOne(CouponModel);

// @desc   Create a new Coupon
// @route  POST /api/v1/coupons
// @access Private(Admin)
exports.createCoupon = factory.createOne(CouponModel);

// @desc   Update a Coupon
// @route  PUT /api/v1/coupons/:id
// @access Private(Admin)
exports.updateCoupon = factory.updateOne(CouponModel);

// @desc   Delete a Coupon
// @route  DELETE /api/v1/coupons/:id
// @access Private(Admin)
exports.deleteCoupon = factory.deleteOne(CouponModel);
