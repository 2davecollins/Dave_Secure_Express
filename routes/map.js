const express = require('express'),
	router = express.Router();

//getAPI_KEY = () => '556e345dbb8e85c073a5dde9e4df820b';
//getURLMap = () => 'https://tile.openweathermap.org/map/';

const { getImageMetaData, getGeolocFromAddress,getGeoLocFromIp ,  getGeocodeFromLatLng} = require('../utility/helper');

let markers = require('../models/_datamarkers')


router.get('/', getImageMetaData,(req, res) => {
	console.log(res.locals.geo); 
	console.log("in map");	
	res.render('map');
});

router.get('/addressip', getGeoLocFromIp,(req,res) =>{
	const result = res.locals.geoipadd
	console.log(result);
	let d = [parseFloat(result.latitude),parseFloat(result.longitude)]
	console.log(d);
	markers.push(d);
	res.render('map')
});


router.get('/geocode', getGeocodeFromLatLng,(req,res) =>{
	let response = res.locals.geocode;
	let {geometry} = response;
	//console.log(geometry);
	//console.log(geometry.coordinates);
	let d = [geometry.coordinates[1],geometry.coordinates[0]]
	console.log(d);
	markers.push(d);

	res.render('map',{d:d})
});


module.exports = router;
