const express = require("express");

const {
  addProductToWishList,
  removeProductFromWishList,
  getLoggedUserWishList,
} = require("../services/wishListService");
const { allowTo, protect } = require("../services/authServices");
const {
  addProductToWishListValidator,
  removeProductFromWishListValidator,
} = require("../utils/validators_rules/wishListValidatorRules");

const router = express.Router();

router.use(protect, allowTo("user"));

router.post("/", addProductToWishListValidator, addProductToWishList);
router.delete(
  "/:productId",
  removeProductFromWishListValidator,
  removeProductFromWishList
);

router.get("/", getLoggedUserWishList);

module.exports = router;
