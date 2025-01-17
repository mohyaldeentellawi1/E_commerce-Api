const express = require("express");
const reviewsRoute = require("./reviewRoute");
const {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  productImageProcessing,
} = require("../services/productServices");
const { protect, allowTo } = require("../services/authServices");
const {
  getProdcutValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators_rules/productValidators");

const router = express.Router();

// Nested Routes
// get subcategories of a specific category
router.use("/:productId/reviews", reviewsRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    protect,
    allowTo("admin"),
    uploadProductImages,
    productImageProcessing,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProdcutValidator, getProduct)
  .put(
    protect,
    allowTo("admin"),
    uploadProductImages,
    productImageProcessing,
    updateProductValidator,
    updateProduct
  )
  .delete(protect, allowTo("admin"), deleteProductValidator, deleteProduct);

module.exports = router;
