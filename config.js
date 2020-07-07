const opencage = require('opencage-api-client');
var NodeGeocoder = require('node-geocoder');

exports.geolocation = (address) => {
  var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: process.env.OCD_API_KEY
  });
  geocoder.geocode(address)
    .then(function(res) {
        console.log([res[0].longitude, res[0].latitude]);
    })
    .catch(error => {
        console.log('error: ', error.message);
    });
}


// ... prints
// Theresienhöhe 11, 80339 Munich, Germany
// { lat: 48.1341651, lng: 11.5464794 }
// Europe/Berlin

