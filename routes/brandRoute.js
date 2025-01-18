const express = require("express");
const { protect, allowTo } = require("../services/authServices");
const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  imageProcessing,
} = require("../services/brandServices");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validators_rules/brandValidatorRules");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    protect,
    allowTo("admin"),
    uploadBrandImage,
    imageProcessing,
    createBrandValidator,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    protect,
    allowTo("admin"),
    uploadBrandImage,
    imageProcessing,
    updateBrandValidator,
    updateBrand
  )
  .delete(protect, allowTo("admin"), deleteBrandValidator, deleteBrand);

module.exports = router;
