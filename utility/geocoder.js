const NodeGeocode = require ('node-geocoder'),
    GEOCODER_PROVIDER = require('../config/keys').GEOCODER_PROVIDER,
    GEOCODER_KEY = require('../config/keys').GEOCODER_KEY


const options = {
    provider: GEOCODER_PROVIDER, 
    httpAdapter: 'https',
    apiKey: GEOCODER_KEY,
    formatter: null

}

const geocoder = NodeGeoCoder(options);

module.exports = geocoder;
