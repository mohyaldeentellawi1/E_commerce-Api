const express = require("express");

const { protect, allowTo } = require("../services/authServices");
const {
  createNewOrdeValidator,
  checkOrderIdValidator,
} = require("../utils/validators_rules/orderValidatorRules");
const {
  createNewOrder,
  filterOrdersForLoggedUser,
  getOrders,
  getOrder,
  updateOrderPaidStatus,
  updateOrderDeliverStatus,
  checkoutSession,
} = require("../services/orderServices");

const router = express.Router();

router
  .route("/:cartId")
  .post(protect, allowTo("user"), createNewOrdeValidator, createNewOrder);

router
  .route("/")
  .get(protect, allowTo("admin", "user"), filterOrdersForLoggedUser, getOrders);
router
  .route("/:id")
  .get(protect, allowTo("admin", "user"), checkOrderIdValidator, getOrder);

router
  .route("/:id/pay")
  .put(protect, allowTo("admin"), checkOrderIdValidator, updateOrderPaidStatus);

router
  .route("/:id/deliver")
  .put(
    protect,
    allowTo("admin"),
    checkOrderIdValidator,
    updateOrderDeliverStatus
  );

router
  .route("/checkout-session/:cartId")
  .get(protect, allowTo("user"), checkoutSession);

module.exports = router;
