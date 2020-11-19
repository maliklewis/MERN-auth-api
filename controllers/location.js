const Location = require('../models/location');
const User = require('../models/user');
const users = require('./user');
let {geolocation} = require('../config');

exports.createLocation = (req, res) => {
    //TODO: add logging to aws
    const {province, city, address, lot_size, lot_type} = req.body;
    let coordinates = [];
    console.log(req.user._id)
    geolocation(address).then((newCoords) => {
        coordinates = [newCoords[0].latitude, newCoords[0].longitude];
        const location = new Location({ province, city, address, lot_size, lot_type, owner_id: req.user._id, geolocation: { coordinates } });
        location.save((err, location) => {
            if (err) {
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
};

exports.getLocationsByAddress = (req, res) => {
    //TODO: add logging to aws
    const { address } = req.body;
    geolocation(address).then((newCoords) => {
        const coordinates = [newCoords[0].latitude, newCoords[0].longitude];
        console.log(coordinates[0]);
        Location.find({
            geolocation: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [coordinates[0], coordinates[1]]
                    }
                }
            }
        },
            (err, locations) => {
                if (err || !locations) {
                    return res.status(400).json({
                        error: 'No locations found'
                    });
                }
                if (locations) {
                    return res.status(200).json({
                        locations: locations
                    });
                }
            });
    });
};

exports.getLocationsByUserId = (req, res) => {
    //TODO: add logging to aws
    Location.find({ owner_id: req.user._id }, (err, locations) => {
        if (err || !locations) {
            return res.status(400).json({
                error: 'No locations found'
            });
        }  
        return res.status(200).json({
            locations: locations
        });
    });
};

exports.deleteLocation = (req, res) => {
    //TODO:
}