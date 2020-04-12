const express = require('express'),
	router = express.Router();

//getAPI_KEY = () => '556e345dbb8e85c073a5dde9e4df820b';
//getURLMap = () => 'https://tile.openweathermap.org/map/';

const { getImageMetaData, getGeolocFromAddress } = require('../utility/helper');




router.get('/', getImageMetaData,(req, res) => {
	console.log(res.locals.geo); 
	console.log("in map");
	
	res.render('map');
});

module.exports = router;
