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
  updateQuantityForItemValidator,
  removeItemFromCartValidator,
} = require("../utils/validators_rules/userCartValidatorRules");

const router = express.Router();

router
  .route("/")
  .post(protect, allowTo("user"), addToCartValidator, addToCart)
  .get(protect, allowTo("user"), getLoggedUserCart)
  .delete(protect, allowTo("user"), clearUserCart);

router.put("/applyCoupon", protect, allowTo("user"), applyCoupon);

router
  .route("/:itemId")
  .put(
    protect,
    allowTo("user"),
    updateQuantityForItemValidator,
    updateQuantityForItem
  )
  .delete(
    protect,
    allowTo("user"),
    removeItemFromCartValidator,
    removeItemFromCart
  );

module.exports = router;
