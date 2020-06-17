const express = require('express');
const router = express.Router();

//controller
const {createLocation} = require('../controllers/location');

//import validator
const {locationCreationValidator} = require('../validators/location');

router.post('/create', locationCreationValidator, createLocation);

module.exports = router;