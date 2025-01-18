const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const ApiError = require("../apiError");
const UserModel = require("../../models/userModel");

exports.addAddressToUserValidator = [
  check("alias")
    .notEmpty()
    .withMessage("Alias is required")
    .isString()
    .withMessage("Alias should be a string"),
  check("details")
    .notEmpty()
    .withMessage("Details is required")
    .isString()
    .withMessage("Details should be a string"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["tr-TR", "ar-SY"], { strictMode: true })
    .withMessage("Invalid Phone Number for this country"),
  check("city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City should be a string"),
  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid Postal Code")
    .isString()
    .withMessage("Postal Code should be a string"),
  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("addressId")
    .isMongoId()
    .withMessage("Invalid Address Id")
    .notEmpty()
    .withMessage("Address Id is required")
    .custom(async (addressId, { req }) => {
      const address = await UserModel.findById(req.user._id)
        .populate("addresses")
        .exec();
      if (!address.addresses.find((a) => a._id.toString() === addressId)) {
        return Promise.reject(
          new ApiError("Address not found in user's addresses", 404)
        );
      }
      return true;
    }),
  check("alias").optional().isString().withMessage("Alias should be a string"),
  check("details")
    .optional()
    .isString()
    .withMessage("Details should be a string"),
  check("phone")
    .optional()
    .isMobilePhone(["tr-TR", "ar-SY"], { strictMode: true })
    .withMessage("Invalid Phone Number for this country"),
  check("city").optional().isString().withMessage("City should be a string"),
  check("postalCode")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid Postal Code")
    .isString()
    .withMessage("Postal Code should be a string"),
  validatorMiddleware,
];

exports.deleteAddressValidator = [
  check("addressId")
    .isMongoId()
    .withMessage("Invalid Address Id")
    .notEmpty()
    .withMessage("Address Id is required")
    .custom(async (addressId, { req }) => {
      const address = await UserModel.findById(req.user._id)
        .populate("addresses")
        .exec();
      if (!address.addresses.find((a) => a._id.toString() === addressId)) {
        return Promise.reject(
          new ApiError("Address not found in user's addresses", 404)
        );
      }
      return true;
    }),
];
