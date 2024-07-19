const express = require('express');
const subCategoryRoute = require('./subCategoryRoute');
const { getCategories , createCategory , getCategory , updateCategory , deleteCategory } = require('../services/categorySevices');
const { getCategoryValidator, createCategoryValidator ,updateCategoryValidator , deleteCategoryValidator } = require('../utils/validators_rules/categoryValidatorRules');
const router = express.Router();


// get subcategories of a main category
router.use('/:categoryId/subcategories', subCategoryRoute);

router.route('/').get(getCategories).post(createCategoryValidator, createCategory);
router.route('/:id')
.get(getCategoryValidator,getCategory)
.put(updateCategoryValidator, updateCategory)
.delete(deleteCategoryValidator, deleteCategory);

module.exports = router;