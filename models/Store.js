const mongoose = require('mongoose'),
	{ getAddressFromLatLng, getLatLonFromAddress } = require('../utility/geolocation');

const StoreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		trim: true,
		maxLength: [30, 'Name cant be more than 30 characters'],
		uppercase: true
	},
	address: {
		type: String,
		required: false,
	},
	location: {
		//GeoJson Point
		type: {
			type: String,
			enum: ['Point'],
		},
		coordinates: {
			type: [Number],
			index: '2dsphere',
		},		
		road: String,
		city: String,
		county: String,
		country: String,
		country_code: String,
	},
});

StoreSchema.pre('save', async function(next) {
	const data = await getLatLonFromAddress(this.address);
    const loc = data.features[0];
  
	const coord = {
		latitude: parseFloat(loc.geometry.coordinates[1]),
		longtitude: parseFloat(loc.geometry.coordinates[0]),
    };
    console.log(coord);

	let faddress = await getAddressFromLatLng(coord);
	faddress = faddress.features[0].properties.address;

	this.location = {
		type: 'Point',
		coordinates: [loc.geometry.coordinates[1], loc.geometry.coordinates[0]],
		// formattedAddress: faddress.properties.formattedAddress,
		 road: faddress.road,
		 city: faddress.city,
		 county: faddress.county,
		 country: faddress.country,
		 country_code: faddress.countryCode
	};

	next();
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
