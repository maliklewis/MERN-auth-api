const opencage = require('opencage-api-client');
var NodeGeocoder = require('node-geocoder');

exports.geolocation = async (address) => {
  var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: process.env.OCD_API_KEY
  });
  const data = await geocoder.geocode(address);
  return data;
  // return geocoder.geocode(address, function(err, res) {
  //   res[[0].longitude, res[0].latitude];
  // })
  // return geocoder.geocode(address)
  //   .then(function(res) {
  //       ([res[0].longitude, res[0].latitude]);
  //   })
  //   .catch(error => {
  //       console.log('error: ', error.message);
  //   });
}


// ... prints
// Theresienhöhe 11, 80339 Munich, Germany
// { lat: 48.1341651, lng: 11.5464794 }
// Europe/Berlin

