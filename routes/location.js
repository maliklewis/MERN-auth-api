const express = require('express');
const router = express.Router();

//controller
const {createLocation} = require('../controllers/location');
const {requireSignin} = require('../controllers/auth'); 

//import validator
const {locationCreationValidator} = require('../validators/location');

router.post('/create', locationCreationValidator, requireSignin, createLocation);

module.exports = router;