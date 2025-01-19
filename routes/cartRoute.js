const express = require("express");
const { protect, allowTo } = require("../services/authServices");

const {
  addToCart,
  getLoggedUserCart,
  removeItemFromCart,
  clearUserCart,
  updateQuantityForItem,
  applyCoupon,
} = require("../services/cartServices");
const {
  addToCartValidator,
} = require("../utils/validators_rules/userCartValidatorRules");

const router = express.Router();

router
  .route("/")
  .post(protect, allowTo("user"), addToCartValidator, addToCart)
  .get(protect, allowTo("user"), getLoggedUserCart)
  .delete(protect, allowTo("user"), clearUserCart);

router.route("/:applyCoupon").put(protect, allowTo("user"), applyCoupon);

router
  .route("/:itemId")
  .put(protect, allowTo("user"), updateQuantityForItem)
  .delete(protect, allowTo("user"), removeItemFromCart);

module.exports = router;
