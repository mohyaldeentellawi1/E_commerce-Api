const express = require('express');
const subCategoryRoute = require('./subCategoryRoute');
const { getCategories , createCategory , getCategory , updateCategory , deleteCategory , uploadCategoryImage , imageProcessing } = require('../services/categorySevices');
const { getCategoryValidator, createCategoryValidator ,updateCategoryValidator , deleteCategoryValidator } = require('../utils/validators_rules/categoryValidatorRules');
const router = express.Router();




// get subcategories of a main category
router.use('/:categoryId/subcategories', subCategoryRoute);

router.route('/').get(getCategories).post(uploadCategoryImage, imageProcessing , createCategoryValidator, createCategory);
router.route('/:id')
.get(getCategoryValidator,getCategory)
.put(uploadCategoryImage, imageProcessing ,  updateCategoryValidator, updateCategory)
.delete(deleteCategoryValidator, deleteCategory);

module.exports = router;