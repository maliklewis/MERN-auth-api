const opencage = require('opencage-api-client');
var NodeGeocoder = require('node-geocoder');

exports.geolocation = async (address) => {
  var geocoder = NodeGeocoder({
    provider: 'opencage',
    apiKey: process.env.OCD_API_KEY
  });
  const data = await geocoder.geocode(address);
  return data;
}