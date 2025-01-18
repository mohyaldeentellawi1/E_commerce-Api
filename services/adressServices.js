const asyncHandler = require("express-async-handler");

const UserModel = require("../models/userModel");

// @desc   Add Adress to the User adresses list
// @route  POST /api/v1/adresses
// @access Private (User)
exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Address added successfully",
    data: user.addresses,
  });
});

// @desc   Remove Address from the User adresses list
// @route  DELETE /api/v1/adresses/:addressId
// @access Private (User)
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Address removed successfully",
    data: user.addresses,
  });
});

// @desc   Get logged user Addresses
// @route  GET /api/v1/adresses
// @access Private (User)
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("addresses");
  res.status(200).json({
    success: true,
    message: "User's addresses fetched successfully",
    result: user.addresses.length,
    data: user.addresses,
  });
});

// @desc   Update Address from the User adresses list
// @route  PUT /api/v1/adresses/:addressId
// @access Private (User)
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findOneAndUpdate(
    { _id: req.user._id, "addresses._id": req.params.addressId },
    {
      $set: {
        "addresses.$.alias": req.body.alias,
        "addresses.$.details": req.body.details,
        "addresses.$.phone": req.body.phone,
        "addresses.$.city": req.body.city,
        "addresses.$.postalCode": req.body.postalCode,
      },
    },
    { new: true }
  );
  const updatedAddress = user.addresses.find(
    (address) => address._id.toString() === req.params.addressId
  );
  res.status(200).json({
    success: true,
    message: "Address updated successfully",
    data: updatedAddress,
  });
});
