const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdOn: {
		type: Date,
		default: Date.now,
	},
	location: {
		//GeoJson Point
		type: {
			type: String,
			enum: ['Point']
		},
		coordinates: {
			type: [Number],
			index: '2dsphere'
		},
		formattedAddrress: String,
		road:String,
		city:String,
		county:String,
		country:String,
		country_code: String
	}
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
