const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser, uploadUserImage, imageProcessing, updatePassword } = require('../services/userServices');
const { protect, allowTo } = require('../services/authServices');
const { getUserValidator, createUserValidator, updateUserValidator, deleteUserValidator, updatePasswordValidator } = require('../utils/validators_rules/userValidatorRules');
const router = express.Router();



router.put("/updatePassword/:id",
    protect, allowTo("admin", 'manager', 'user'),
    updatePasswordValidator, updatePassword);
router.route('/').get(
    protect, allowTo("admin", 'manager'),
    getUsers).post(
        protect, allowTo("admin", 'manager', 'user'),
        uploadUserImage, imageProcessing, createUserValidator, createUser);
router.route('/:id')
    .get(
        protect, allowTo("admin", 'manager', 'user'),
        getUserValidator, getUser)
    .put(
        protect, allowTo("admin", 'manager', 'user'),
        uploadUserImage, imageProcessing, updateUserValidator, updateUser)
    .delete(
        protect, allowTo("admin", 'manager', 'user'),
        deleteUserValidator, deleteUser);

module.exports = router;