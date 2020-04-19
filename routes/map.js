const express = require('express'),
	router = express.Router();

//getAPI_KEY = () => '556e345dbb8e85c073a5dde9e4df820b';
//getURLMap = () => 'https://tile.openweathermap.org/map/';

const { getImageMetaData, getGeolocFromAddress,getGeoLocFromIp ,  getGeocodeFromLatLng} = require('../utility/helper');
const { getAddressFromLatLng,getLatLonFromAddress } = require('../utility/geolocation');
let markers = require('../models/_datamarkers')


router.get('/', getImageMetaData,(req, res) => {
	console.log(res.locals.geo); 
	console.log("in map");	
	res.render('map');
});

router.get('/addressip', getGeoLocFromIp,(req,res) =>{
	const result = res.locals.geoipadd
	//console.log(result);
	let d = [parseFloat(result.latitude),parseFloat(result.longitude)]
	//console.log(d);
	markers.push(d);
	res.render('map')
});


router.get('/geocode',(req,res) =>{

	// markers.push(d);
	getLatLonFromAddress("300+captains+road+crumlin+dublin").then(data =>{
		
		const loc = [data.features[0].geometry.coordinates[1],data.features[0].geometry.coordinates[0]];
		console.log(loc)
		markers.push(loc);
		res.render('map');
		
	}).catch(err =>{
		console.log(err);
		res.render('map');

	});	

});


module.exports = router;
