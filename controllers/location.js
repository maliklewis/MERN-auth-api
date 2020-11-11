const Location = require('../models/location');
const User = require('../models/user');
//import {geolocation} from '../config';
let {geolocation} = require('../config');

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
    var coordinates = []
    console.log(req.user._id)
    geolocation(address).then((newCoords) => {
        coordinates = [newCoords[0].latitude, newCoords[0].longitude]
        const location = new Location({province, city, address, lot_size, lot_type, owner_id: req.user._id, geolocation: {coordinates}});
        location.save((err, location) => {
            if (err){
                console.log('SAVE LOCATION ERROR: ', err)
                return res.status(401).json({
                    error: 'Error saving location to database, please try to create location again'
                });
            }
            return res.json({
                message: 'Success, location created!',
                location: location
            })
        });
    });
    //coordinates = coordinates.then();
    //console.dir(coordinates);
    
};

exports.getLocations = (req, res) => {
    //
}