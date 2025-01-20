const express = require("express");

const { protect, allowTo } = require("../services/authServices");
const {
  createNewOrdeValidator,
  getOrderByIdValidator,
} = require("../utils/validators_rules/orderValidatorRules");
const {
  createNewOrder,
  filterOrdersForLoggedUser,
  getOrders,
  getOrder,
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
  .get(protect, allowTo("admin", "user"), getOrderByIdValidator, getOrder);

module.exports = router;
