const express = require('express');
const { getBrands, getBrand, createBrand , updateBrand , deleteBrand , uploadBrandImage , imageProcessing} = require('../services/brandServices');
const { getBrandValidator, createBrandValidator , updateBrandValidator , deleteBrandValidator,  } = require('../utils/validators_rules/brandValidatorRules');
const router = express.Router();


router.route('/').get(getBrands).post(uploadBrandImage, imageProcessing, createBrandValidator, createBrand);
router.route('/:id')
.get(getBrandValidator,getBrand)
.put(uploadBrandImage, imageProcessing, updateBrandValidator, updateBrand)
.delete(deleteBrandValidator, deleteBrand);

module.exports = router;