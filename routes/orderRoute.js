const express = require("express");

const { protect, allowTo } = require("../services/authServices");
const {
  createNewOrdeValidator,
} = require("../utils/validators_rules/orderValidatorRules");
const { createNewOrder } = require("../services/orderServices");

const router = express.Router();

router
  .route("/:cartId")
  .post(protect, allowTo("user"), createNewOrdeValidator, createNewOrder);

module.exports = router;
