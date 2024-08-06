const express = require('express');
const { createSubCategory, getSubCategories, getSubCategory, updateSubCategory, deleteSubCategory, setCategoryIdFromParams, createFilterObject } = require('../services/subCategoryService');
const { protect, allowTo } = require('../services/authServices');
const { createSubcategoryValidator, getSubcategoryValidator, updateSubcategoryValidator, deleteSubcategoryValidator } = require("../utils/validators_rules/subCategoryValidatorRules");

// MargeParams Allow us to access the params from the parent route
const router = express.Router({ mergeParams: true });

router.route('/').post(
    protect, allowTo("admin", 'manager'),
    setCategoryIdFromParams, createSubcategoryValidator, createSubCategory).get(createFilterObject, getSubCategories);
router.route('/:id')
    .get(getSubcategoryValidator, getSubCategory)
    .put(
        protect, allowTo("admin", 'manager'),
        updateSubcategoryValidator, updateSubCategory)
    .delete(
        protect, allowTo("admin", 'manager'),
        deleteSubcategoryValidator, deleteSubCategory);


module.exports = router;