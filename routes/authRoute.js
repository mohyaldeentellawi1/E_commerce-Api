const express = require('express');
const {register , login , forgetPassword}  = require('../services/authServices');
const {registerValidator, loginValidator} = require('../utils/validators_rules/authValidatorRules');
const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login',loginValidator, login);
router.post('/forget-password', forgetPassword);



module.exports = router;