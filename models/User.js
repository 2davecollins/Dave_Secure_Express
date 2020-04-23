'use strict';
const mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcryptjs'),
	logger = require('../config/winston'),
	{ getLatLngFromIp } = require('../utility/geolocation'),
	JWT_SECRET = 'THEbestKEPTsecretINdublin',
	JWT_EXPIRE = '1d',
	MAX_LOGIN_ATTEMPTS = 2, //for testing
	LOCK_TIME = 2 * 60 * 1000; //2min
let reasons;
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
	role: {
		type: String,
		enum: ['user', 'superuser', 'admin'],
		default: 'user',
	},
	ip: {
		type: String,
		required: false,
		default: '83.71.10.171',
	},
	loginAttempts: {
		type: Number,
		required: true,
		default: 0,
	},
	lockUntil: {
		type: Number,
	},
	timezone: {
		type: String,
	},
	country_code: {
		type: String,
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
	},
});

UserSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2,
};

UserSchema.virtual('isLocked').get(function() {
	// check for a future lockUntil timestamp
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

UserSchema.methods.incLoginAttempts = function(cb) {
	// if we have a previous lock that has expired, restart at 1
	if (this.lockUntil && this.lockUntil < Date.now()) {
		return this.update(
			{
				$set: { loginAttempts: 1 },
				$unset: { lockUntil: 1 },
			},
			cb
		);
	}
	// otherwise we're incrementing
	var updates = { $inc: { loginAttempts: 1 } };
	// lock the account if we've reached max attempts and it's not locked already
	if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	}
	return this.update(updates, cb);
};

UserSchema.statics.getAuthenticated = function(username, password, cb) {
	this.findOne({ username: username }, function(err, user) {
		if (err) return cb(err);

		// make sure the user exists
		if (!user) {
			return cb(null, null, reasons.NOT_FOUND);
		}

		// check if the account is currently locked
		if (user.isLocked) {
			// just increment login attempts if account is already locked
			return user.incLoginAttempts(function(err) {
				if (err) return cb(err);
				return cb(null, null, reasons.MAX_ATTEMPTS);
			});
		}

		// test for a matching password
		user.comparePassword(password, function(err, isMatch) {
			if (err) return cb(err);

			// check if the password was a match
			if (isMatch) {
				// if there's no lock or failed attempts, just return the user
				if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
				// reset attempts and lock info
				var updates = {
					$set: { loginAttempts: 0 },
					$unset: { lockUntil: 1 },
				};
				return user.update(updates, function(err) {
					if (err) return cb(err);
					return cb(null, user);
				});
			}

			// password is incorrect, so increment login attempts before responding
			user.incLoginAttempts(function(err) {
				if (err) return cb(err);
				return cb(null, null, reasons.PASSWORD_INCORRECT);
			});
		});
	});
};

UserSchema.pre('save', async function(next) {
	// get coords from address
	const data = await getLatLngFromIp(this.ip);

	if (data.success) {
		const ip = data.ip;
		const lat = data.latitude;
		const lng = data.longitude;
		const coord = [parseFloat(lat), parseFloat(lng)];
		const country_code = data.country_code;
		const timezone = data.timezone_gmt;
		console.log(`${ip}  ${lat}  ${lng} ${coord}${country_code}  ${timezone}`);
		this.timezone = timezone;
		this.country_code = country_code;

		this.location = {
			type: 'Point',
			coordinates: coord,
		};
	} else {
		logger.log('warn', `data not available for ${this.ip}`);
	}

	next();
});

UserSchema.methods.getSignedJWTToken = function() {
	return jwt.sign({ id: this._id }, JWT_SECRET, {
		expiresIn: JWT_EXPIRE,
	});
};

UserSchema.methods.matchPassword = async function(enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
