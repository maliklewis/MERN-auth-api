const mongoose = require('mongoose');
const Nodegeocoder = require('node-geocoder');

//user schema
const locationSchema = new mongoose.Schema({
    province: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        unique: true,
        required: true
    },
    lot_size: {
        type: String,
        required: true,
        default: 'All'
    },
    lot_type: {
        type: String,
        required: true,
        default: 'Outdoor'
    },
    owner_id: String,
    geolocation: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true,
            default: 'Point'
          },
          coordinates: {
            type: [Number],
            required: true
          }
    }
}, {timestamps: true});

module.exports = mongoose.model('Location', locationSchema)