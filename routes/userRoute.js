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
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deactiveLoggedUser: deleteLoggedUser,
} = require("../services/userServices");
const { protect, allowTo } = require("../services/authServices");
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  updatePasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
} = require("../utils/validators_rules/userValidatorRules");

const router = express.Router();

router.get("/get-me", protect, getLoggedUserData, getUser);
router.put(
  "/update-my-password",
  protect,
  updateLoggedUserPasswordValidator,
  updateLoggedUserPassword
);
router.put(
  "/update-me",
  protect,
  uploadUserImage,
  imageProcessing,
  updateLoggedUserValidator,
  updateLoggedUserData
);
router.put("/delete-me", protect, deleteLoggedUser);

router.use(protect, allowTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, imageProcessing, createUserValidator, createUser);

router.put("/updatePassword/:id", updatePasswordValidator, updatePassword);

router.put("/updateUserRoles/:id", updateRole);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
