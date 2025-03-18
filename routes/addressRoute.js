const express = require("express");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
  updateAddress,
  getAddressById,
} = require("../services/adressServices");
const { allowTo, protect } = require("../services/authServices");
const {
  addAddressToUserValidator,
  updateAddressValidator,
  deleteAddressValidator,
  getAddressByIdValidator,
} = require("../utils/validators_rules/addressesValidatorRules");

const router = express.Router();

router.use(protect, allowTo("user"));

router.post("/", addAddressToUserValidator, addAddress);
router.delete("/:addressId", deleteAddressValidator, removeAddress);
router.put("/:addressId", updateAddressValidator, updateAddress);
router.get("/:addressId", getAddressByIdValidator, getAddressById);
router.get("/", getLoggedUserAddresses);

module.exports = router;
