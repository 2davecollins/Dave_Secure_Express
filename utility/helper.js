'use strict';
const exiftool = require('node-exiftool'),
	exiftoolBin = require('dist-exiftool'),	
	fs = require('fs'),
	path = require('path'),
	fetch = require('node-fetch');



const ep = new exiftool.ExiftoolProcess(exiftoolBin);
//convert gps degrees minutes seconds to decimal
function ParseDMS(input) {
	var parts = input.split(/[^\d\w\.]+/);
	var lat = ConvertDMSToDD(parts[0], parts[2], parts[3], parts[4]);
	var lng = ConvertDMSToDD(parts[5], parts[7], parts[8], parts[9]);

	return {
		Latitude: lat,
		Longitude: lng,
		Position: lat + ',' + lng,
	};
}
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
	var dd = Number(degrees) + Number(minutes) / 60 + Number(seconds) / (60 * 60);

	if (direction == 'S' || direction == 'W') {
		dd = dd * -1;
	} // Don't do anything for N or E
	return dd;
}

function getAppdressFromIP(ip) {
	return fetch(`http://free.ipwhois.io/json/${ip}`);
}

function getLatLonFromAddr(address) {
	let url = `https://nominatim.openstreetmap.org/search?q=${address}&format=geojson`;
	return fetch(url).then(res => res.json());
}

module.exports = {
	getImageMetaData: image => (req, res, next) =>{
		console.log(req);
		if (req.isAuthenticated()) {
			return next();
		}
		const PHOTO_PATH = path.join(__dirname, `../public/uploads/${image}`);
		console.log(PHOTO_PATH);
		const rs = fs.createReadStream(PHOTO_PATH);
		ep.open()
			.then(() => ep.readMetadata(rs, ['-File:all']))
			.then(result => {
				//console.log(res);
				if (result.data) {
					//console.log(res.data)
					if (result.data.length > 0) {
						//console.log(res.data[0])
						if (result.data[0].GPSPosition) {
							let geodata = ParseDMS(result.data[0].GPSPosition);
							res.locals.geo = geodata;
							next();
						} else {
							console.log('No GPSPosition');
							res.locals.geo = { msg: 'No Data' };
							next();
						}
					}
				} else {
					console.log('No metadata');
					res.locals.geo = { msg: 'No Data' };
					next();
				}
			})
			.then(
				() => ep.close(),
				() => ep.close()
			)
			.catch(console.error);

		//req.flash('error_msg', 'Please log in to view that resource');
		//res.redirect('/map');
	},
	
	getGeoLocFromIp: async function(req, res, next) {
		try {
			const data = await getAppdressFromIP('83.71.10.255');
			res.locals.geoipadd = await data.json();
			next();
		} catch (err) {
			console.log(err);
			next();
		}
	},
	getAddFromLatLng: async (req, res, next) => {
		let result;
		try {
			result = geocoder.reverse({ lat: 53.3165322, lon: -6.3425318 });
			res.locals.revaddress = result;
		} catch (err) {
			console.log(err);
			next();
		}
	},
	getLatLonFromAddress: async (req, res, next) => {
		let result;
		let address;
		try {			
			result = await getLatLonFromAddr(address);
			res.locals.geocode = result.features[0];
			next();
		} catch (err) {
			console.log(err);
			next();
		}
	},
	asyncHandler: fn => (req,res,next) => {
		Promise.resolve(fn(req,res,next).catch(next));
	}
};
