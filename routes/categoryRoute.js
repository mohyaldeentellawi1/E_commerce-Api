const express = require("express");
const subCategoryRoute = require("./subCategoryRoute");
const { protect, allowTo } = require("../services/authServices");
const {
  getCategories,
  createCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  imageProcessing,
} = require("../services/categorySevices");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators_rules/categoryValidatorRules");
const router = express.Router();

// Nested Routes
// get subcategories of a specific category
router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    protect,
    allowTo("admin", "manager"),
    uploadCategoryImage,
    imageProcessing,
    createCategoryValidator,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    protect,
    allowTo("admin", "manager"),
    uploadCategoryImage,
    imageProcessing,
    updateCategoryValidator,
    updateCategory
  )
  .delete(
    protect,
    allowTo("admin", "manager"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
