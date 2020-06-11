const express = require('express');
const router = express.Router();

//controller
const {
    signup,
    accountActivation,
    signin,
    googleLogin
} = require('../controllers/auth');

//import validator
const {userSignupValidator, userSigninValidator} = require('../validators/auth')
const {runValidation} = require('../validators') //if the file is names index.js you dont need to write it

router.post('/signup', userSignupValidator, runValidation, signup);
router.post('/account-activation', accountActivation);
router.post('/signin', userSigninValidator, runValidation, signin);

//google and facebook
router.post('/google-login', googleLogin)

module.exports = router;