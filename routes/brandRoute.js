const express = require('express');
const { getBrands, getBrand, createBrand , updateBrand , deleteBrand , uploadBrandImage , imageProcessing} = require('../services/brandServices');
const { protect, allowTo } = require('../services/authServices');
const { getBrandValidator, createBrandValidator , updateBrandValidator , deleteBrandValidator,  } = require('../utils/validators_rules/brandValidatorRules');
const router = express.Router();


router.route('/').get(getBrands).post(
    protect , allowTo("admin", 'manager'),
    uploadBrandImage, imageProcessing, createBrandValidator, createBrand);
router.route('/:id')
.get(getBrandValidator,getBrand)
.put(
    protect, allowTo("admin", 'manager'),
    uploadBrandImage, imageProcessing, updateBrandValidator, updateBrand)
.delete(
    protect, allowTo("admin", 'manager'),
    deleteBrandValidator, deleteBrand);

module.exports = router;