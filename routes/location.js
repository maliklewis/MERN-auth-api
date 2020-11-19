const express = require('express');
const router = express.Router();
//controller
const {createLocation, getLocationsByAddress, getLocationsByUserId} = require('../controllers/location');
const {requireSignin} = require('../controllers/auth'); 
//import validator
const {locationCreationValidator} = require('../validators/location');

router.post('/create', locationCreationValidator, requireSignin, createLocation);
router.get('/locations', getLocationsByAddress);
router.get('/userLocations', requireSignin, getLocationsByUserId);

module.exports = router;