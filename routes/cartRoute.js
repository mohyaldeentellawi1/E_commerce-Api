const express = require("express");
const { protect, allowTo } = require("../services/authServices");

const { addToCart } = require("../services/cartServices");
const {
  addToCartValidator,
} = require("../utils/validators_rules/userCartValidatorRules");

const router = express.Router();

// router.use(protect, allowTo("user"));

router.route("/").post(protect, allowTo("user"), addToCartValidator, addToCart);

module.exports = router;
