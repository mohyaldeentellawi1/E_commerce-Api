const express = require("express");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
  updateAddress,
} = require("../services/adressServices");
const { allowTo, protect } = require("../services/authServices");
const {
  addAddressToUserValidator,
  updateAddressValidator,
  deleteAddressValidator,
} = require("../utils/validators_rules/addressesValidatorRules");

const router = express.Router();

router.use(protect, allowTo("user"));

router.post("/", addAddressToUserValidator, addAddress);
router.delete("/:addressId", deleteAddressValidator, removeAddress);
router.put("/:addressId", updateAddressValidator, updateAddress);

router.get("/", getLoggedUserAddresses);

module.exports = router;
