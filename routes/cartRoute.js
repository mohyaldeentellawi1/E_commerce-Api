const express = require("express");
const { protect, allowTo } = require("../services/authServices");

const { addToCart, getLoggedUserCart } = require("../services/cartServices");
const {
  addToCartValidator,
} = require("../utils/validators_rules/userCartValidatorRules");

const router = express.Router();

router
  .route("/")
  .post(protect, allowTo("user"), addToCartValidator, addToCart)
  .get(protect, allowTo("user"), getLoggedUserCart);

module.exports = router;
