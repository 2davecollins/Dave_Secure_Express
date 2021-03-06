'use strict';
const express = require('express'),
	router = express.Router(),
	bcrypt = require('bcryptjs'),
	passport = require('passport'),
	User = require('../models/User'),
	owasp = require('owasp-password-strength-test'),
	https = require('https'),
	crypto = require('crypto'),
	{ forwardAuthenticated } = require('../config/auth');

// configure password requirements
owasp.config({
	allowPassphrases: false,
	maxLength: 64,
	minLength: 10,
	minPhraseLength: 20,
	minOptionalTestsToPass: 4,
});

const logger = require('../config/winston');

const svgCaptcha = require('svg-captcha');

router.get('/captcha', function(req, res) {
	var captcha = svgCaptcha.createMathExpr({
		fontSize: 60,
		color: true,
		size: 1,
		noise: 3,
		width: 100,
		height: 100,
		mathOperator: '+',
		mathMin: 1,
		mathMax: 4,
	});

	req.session.captcha = captcha.text;
	res.type('svg');
	res.status(200).send(captcha.data);
});

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => {
	req.flash('success_msg', 'logged in');
	res.render('login');
});

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.post('/register', (req, res) => {
	const { name, email, password, password2 } = req.body;
	const owaspcheck = owasp.test(password);

	let hashedPassword = crypto
		.createHash('sha1')
		.update(password)
		.digest('hex')
		.toUpperCase();

	let prefix = hashedPassword.slice(0, 5);
	let apiCall = `https://api.pwnedpasswords.com/range/${prefix}`;
	let hashes = '';
	let errors = [];
	logger.info(`Logging new user registration ${name}`);

	https
		.get(apiCall, r => {
			r.setEncoding('utf8');
			r.on('data', chunk => (hashes += chunk));
			r.on('end', afterPwnedCheck);
		})
		.on('error', err => {			
			logger.log('warn', `haveibeenpawned error ${err}`);
		});

	function afterPwnedCheck() {
		let result = hashes.split('\r\n').map(h => {
			let sp = h.split(':');
			return {
				hash: prefix + sp[0],
				count: parseInt(sp[1]),
			};
		});
		let found = result.find(h => h.hash === hashedPassword);
		if (found) {			
			logger.log('warn', `Found ${found.count} matched Password ${password} it should not be used`);
			errors.push({ msg: `Password compromised ${found.count} times` });
		} 
		if (!name || !email || !password || !password2) {
			errors.push({ msg: 'Please enter all fields' });
		}

		if (password != password2) {
			errors.push({ msg: 'Passwords do not match' });
		}
		if (owaspcheck.errors.length > 0) {
			if (owaspcheck.failedTests.length > 0) {
				errors.push({ msg: 'OSWAP SAYS NO\n\t\t' + owaspcheck.errors[0] });
			}
		}
		// Check for Errors or check for password registered

		if (errors.length > 0) {
			res.render('register', {
				errors,
				name,
				email,
				password,
				password2,
			});
		} else {
			User.findOne({ email: email }).then(user => {
				if (user) {
					errors.push({ msg: 'Email already exists' });
					res.render('register', {
						errors,
						name,
						email,
						password,
						password2,
					});
				} else {
					const newUser = new User({
						name,
						email,
						password,
					});
					// encrypt password prior to saving to data base
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;
							newUser.password = hash;
							newUser
								.save()
								.then(user => {									
									logger.log('info', 'new user registered');
									req.flash('success_msg', 'You are now registered and can log in');
									res.redirect('/users/login');
								})
								.catch(err => console.log(err));
						});
					});
				}
			});
		}
	}
});

// Login
router.post('/login', (req, res, next) => {
	req.app.locals.loginstate = true;
	const ip =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.remoteAddress : null);
	const ipa = ip.split(':');
	console.log(ipa[3]);
	req.app.locals.ip = `${ipa[3]}`;
	logger.log('info', ` ${ipa[3]} logging in`);
	req.flash('success_msg', 'logged in');

	passport.authenticate('local', {
		successRedirect: '/dashboard',
		failureRedirect: '/users/login',
		failureFlash: true,
	})(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
	const ip =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		(req.connection.socket ? req.connection.remoteAddress : null);
	const ipa = ip.split(':');
	logger.log('info', `${ipa[3]} has logged out`);
	req.app.locals.loginstate = false;
	
	req.app.locals.ip = '';
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports = router;
