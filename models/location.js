const mongoose = require('mongoose');
const crypto = require('crypto');
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
    geolocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, {timestamps: true});

//virtual
// locationSchema.virtual('address')
// .set(function(address) {
//     this._address = address;
//     this.geolocation = this.makeGeolocation(address);
// })
// .get(function(){
//     return this.geolocation;
// })

// //methods
// const options = {
//     provider: 'google'
// }

// locationSchema.methods = {
//     makeGeolocation: function(address) {
//         const geocoder = Nodegeocoder(options);

//         // Or using Promise
//         geocoder.geocode(address)
//         .then(function(res) {
//         console.log(res);
//         })
//         .catch(function(err) {
//         console.log(err);
//         });
//     }
// }

module.exports = mongoose.model('Location', locationSchema)