const Location = require('../models/location');
const opencage = require('opencage-api-client');

exports.createLocation = (req, res) => {
    const {province, city, address, lot_size, lot_type} = req.body;
    const geolocation = [];

    opencage.geocode({q: address})
    .then(data => {
        console.log(JSON.stringify(data));
        if (data.status.code == 200) {
          if (data.results.length > 0) {
            var place = data.results[0];
            console.log(place.formatted);
            console.log(place.geometry.lat);
            geolocation = [place.geometry.lat, place.geometry.lng];
            //console.log(place.annotations.timezone.name);
          }
        } else if (data.status.code == 402) {
          console.log('hit free-trial daily limit');
          //console.log('become a customer: https://opencagedata.com/pricing'); 
        } else {
          // other possible response codes:
          // https://opencagedata.com/api#codes
          console.log('error', data.status.message);
        }
    }).catch(error => {
        console.log('error', error.message);
    });

    const location = new Location({province, city, address, lot_size, lot_type});
    location.save((err, location) =>{
        if (err){
            console.log('SAVE LOCATION ERROR: ', err)
            res.status(401).json({
                error: 'Error saving location to database, please try to create location again'
            });
        }
        return res.json({
            message: 'Success, location created!'
        })
    });
}