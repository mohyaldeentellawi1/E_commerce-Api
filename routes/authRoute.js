const express = require("express");
const {
  register,
  login,
  forgetPassword,
  verifyOtp,
  resetPassword,
} = require("../services/authServices");
const {
  registerValidator,
  loginValidator,
} = require("../utils/validators_rules/authValidatorRules");
const { limiter } = require("../middleware/rateLimiterMiddleWare");

const router = express.Router();

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, limiter(10), login);
router.post("/forget-password", limiter(5), forgetPassword);
router.post("/verify-otp", verifyOtp);
router.put("/reset-password", resetPassword);

module.exports = router;
