const mongoose = require('mongoose'),
	{ getAddressFromLatLng, getLatLonFromAddress } = require('../utility/geolocation'),
	logger = require('../config/winston');

const StoreSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		trim: true,
		maxLength: [30, 'Name cant be more than 30 characters'],
		uppercase: true,
	},
	address: {
		type: String,
		required: false,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	edit: {
		type: Boolean,
		default: true,
	},
	image: {
		type: String,
		default: 'none',
	},
	addedBy: {
		type: String,
		enum: ['user', 'admin', 'editor'],
		default: 'user',
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
	// get coords from address
	let loc;
	let data;
	try {
		data = await getLatLonFromAddress(this.address);
		loc = data.features[0];
	} catch (err) {	
		logger.log('warn', `${err}`);
	}

	if (loc && this.edit) {
		const coord = {
			latitude: parseFloat(loc.geometry.coordinates[1]),
			longtitude: parseFloat(loc.geometry.coordinates[0]),
		};
		// get address from coords
		let faddress = await getAddressFromLatLng(coord);
		faddress = faddress.features[0].properties.address;
		this.location = {
			type: 'Point',
			coordinates: [loc.geometry.coordinates[1], loc.geometry.coordinates[0]],
			road: faddress.road,
			city: faddress.city,
			county: faddress.county,
			country: faddress.country,
			country_code: faddress.countryCode,
		};
	} else {		
		logger.log('warn', `data not available for ${this.address}`);
	}

	next();
});

const Store = mongoose.model('Store', StoreSchema);

module.exports = Store;
