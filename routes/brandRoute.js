const express = require('express');
const { getBrands, getBrand, createBrand , updateBrand , deleteBrand} = require('../services/brandServices');
const { getBrandValidator, createBrandValidator , updateBrandValidator , deleteBrandValidator,  } = require('../utils/validators_rules/brandValidatorRules');
const router = express.Router();


router.route('/').get(getBrands).post(createBrandValidator, createBrand);
router.route('/:id')
.get(getBrandValidator,getBrand)
.put(updateBrandValidator, updateBrand)
.delete(deleteBrandValidator, deleteBrand);

module.exports = router;