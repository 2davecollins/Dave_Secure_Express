/* eslint-disable no-unused-vars */
'use strict';
const express = require('express'),
	router = express.Router();

const { getImageMetaData, getGeolocFromAddress, getGeoLocFromIp, getGeocodeFromLatLng } = require('../utility/helper');
const { getAddressFromLatLng, getLatLonFromAddress } = require('../utility/geolocation');
let markers = [];

router.get('/', getImageMetaData, (req, res) => {
	console.log(res.locals.geo);
	console.log('in map');
	res.render('map');
});

router.get('/addressip', getGeoLocFromIp, (req, res) => {
	const result = res.locals.geoipadd;

	let d = [parseFloat(result.latitude), parseFloat(result.longitude)];

	markers.push(d);
	res.render('map');
});

router.get('/geocode', (req, res) => {
	getLatLonFromAddress('300+captains+road+crumlin+dublin')
		.then(data => {
			const loc = [data.features[0].geometry.coordinates[1], data.features[0].geometry.coordinates[0]];

			markers.push(loc);
			res.render('map');
		})
		.catch(err => {
			console.log(err);
			res.render('map');
		});
});

module.exports = router;
