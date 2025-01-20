const express = require("express");

const { protect, allowTo } = require("../services/authServices");
const {
  createNewOrdeValidator,
} = require("../utils/validators_rules/orderValidatorRules");
const { createNewOrder, getOrders } = require("../services/orderServices");

const router = express.Router();

router
  .route("/:cartId")
  .post(protect, allowTo("user"), createNewOrdeValidator, createNewOrder);

router.route("/").get(protect, allowTo("admin", "user"), getOrders);

module.exports = router;
