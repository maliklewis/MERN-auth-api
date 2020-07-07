const {check} = require('express-validator');

exports.locationCreationValidator = [
    check('province')
    .not()
    .isEmpty()
    .withMessage('Province is required'),
    check('city')
    .not()
    .isEmpty()
    .withMessage('City is required'),
    check('address')
    .not()
    .isEmpty()
    .withMessage('Address is required')
]
