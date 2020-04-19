const mongoose = require('mongoose'),
	{ getLatLngFromIp } = require('../utility/geolocation');

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
	role:{
		type:String,
		enum:['user','superuser','admin'],
		default: 'user'		
	},
	ip:{
		type:String,
		required:false,
		default:'83.71.10.171'
	},	
	timezone: {
		type:String,	
	},	
	country_code:{
		type: String

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
	}
});

UserSchema.pre('save', async function(next) {
	// get coords from address
	const data = await getLatLngFromIp(this.ip);	
	
	if(data.success){
		
		const ip = data.ip;
		const lat = data.latitude;
		const lng = data.longitude;
		const coord = [parseFloat(lat),parseFloat(lng)];
		const country_code = data.country_code;
		const timezone = data.timezone_gmt;
		console.log(`${ip}  ${lat}  ${lng} ${coord}${country_code}  ${timezone}`)
		this.timezone = timezone;
		this.country_code = country_code;

				
		this.location = {
			type: 'Point',
			coordinates: coord				 
		};
				
	}else{
		console.log("data not available for "+this.ip);
		//TODO default location data
	}

	next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
