const express = require('express');
const {getUser,getUsers,createUser,updateUser,deleteUser,uploadUserImage,imageProcessing , updatePassword} = require('../services/userServices');
const {getUserValidator, createUserValidator, updateUserValidator, deleteUserValidator , updatePasswordValidator  } = require('../utils/validators_rules/userValidatorRules');
const router = express.Router();



router.put("/updatePassword/:id", updatePasswordValidator,updatePassword); 
router.route('/').get(getUsers).post(uploadUserImage, imageProcessing, createUserValidator, createUser);
router.route('/:id')
.get(getUserValidator, getUser)
.put(uploadUserImage, imageProcessing, updateUserValidator, updateUser)
.delete(deleteUserValidator, deleteUser);

module.exports = router;