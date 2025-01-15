const express = require("express");
const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  imageProcessing,
  updatePassword,
  updateRole,
} = require("../services/userServices");
const { protect, allowTo } = require("../services/authServices");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
} = require("../utils/validators_rules/userValidatorRules");

const router = express.Router();

router.put(
  "/updatePassword/:id",
  protect,
  allowTo("admin", "user"),
  updatePasswordValidator,
  updatePassword
);

router.put("/updateUserRoles/:id", protect, allowTo("admin"), updateRole);

router
  .route("/")
  .get(protect, allowTo("admin"), getUsers)
  .post(
    protect,
    allowTo("admin"),
    uploadUserImage,
    imageProcessing,
    createUserValidator,
    createUser
  );
router
  .route("/:id")
  .get(protect, allowTo("admin", "user"), getUserValidator, getUser)
  .put(
    protect,
    allowTo("admin", "user"),
    uploadUserImage,
    imageProcessing,
    updateUserValidator,
    updateUser
  )
  .delete(protect, allowTo("admin", "user"), deleteUserValidator, deleteUser);

module.exports = router;
