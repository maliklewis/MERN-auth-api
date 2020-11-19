const express = require('express');
const router = express.Router();

//controller
const {
    signup,
    accountActivation,
    signin,
    googleLogin,
    forgotPassword,
    resetPassword
} = require('../controllers/auth');

//import validator
const {userSignupValidator, userSigninValidator, forgotPasswordValidator, resetPasswordValidator} = require('../validators/auth')
const {runValidation} = require('../validators') //if the file is names index.js you dont need to write it

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation);
router.post('/signin', userSigninValidator, runValidation, signin);

//reset password
router.put('/forgot-password',forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password',resetPasswordValidator, runValidation, resetPassword);

//google and facebook
router.post('/google-login', googleLogin)
//TODO: add facebook validation now that you have an account again

module.exports = router;