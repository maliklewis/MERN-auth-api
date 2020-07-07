const Location = require('../models/location');
const opencage = require('opencage-api-client');
var NodeGeocoder = require('node-geocoder');
//import {geolocation} from '../config';
let {geolocation} = require('../config');

var geocoder = NodeGeocoder({
            provider: 'opencage',
            apiKey: process.env.OCD_API_KEY
          });

// function geolocation(address) {
//     var geocoder = NodeGeocoder({
//         provider: 'opencage',
//         apiKey: process.env.OCD_API_KEY
//       });
//       geocoder.geocode('2329 cotters crescent', function(err, res) {
//         return [res[0].longitude, res[0].latitude];
//       });
// }


exports.createLocation = (req, res) => {
    const {province, city, address, lot_size, lot_type} = req.body;
    // let coordinates = geolocation(address);
    // console.log(geolocation(address));
    let coordinates = geolocation(address);
    console.dir(coordinates);
    //const location = new Location({province, city, address, lot_size, lot_type, geolocation: {coordinates}});
    // location.save((err, location) => {
    //     if (err){
    //         console.log('SAVE LOCATION ERROR: ', err)
    //         return res.status(401).json({
    //             error: 'Error saving location to database, please try to create location again'
    //         });
    //     }
    //     return res.json({
    //         message: 'Success, location created!',
    //     })
    // });
};