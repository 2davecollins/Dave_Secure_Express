/* eslint-disable no-unused-vars */

const monk = require('monk'),
	dbl = require('../config/keys').mongoLOG,
	dblog = monk(dbl),
	logger = require('../config/winston'),
	{ adminlogsAuthenticated } = require('../config/auth'),
	passport = require('passport');

const express = require('express'),
	router = express.Router();
router.get('/', adminlogsAuthenticated, (req, res) => {
	res.render('admin');
});

router.post('/', (req, res, next) => {
	if (req.user.role == 'admin') {
		passport.authenticate('local', {
			successRedirect: '/admin/logs',
			failureRedirect: '/admin',
			failureFlash: true,
		})(req, res, next);
	} else {
		req.flash('success_msg', 'You are Not an Admin');
		res.render('admin');
	}
});

router.get('/logs', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('apache');
	const options = {
		projection: { _id: 0 },
		sort: { timestamp: -1 },
	};

	if (req.user.role !== 'admin') {
		req.flash('success_msg', 'You are not an admin');
		res.render('admin');
	} else {
		collection.find({}, options, (err, docs) => {
			if (err) {
				logger.log('warn', `mongodb logs error ${err}`);
			}
			logger.log('info', 'logs being viewed');
			res.render('logs', { loglist: docs });
		});
	}
});

router.get('/users', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};

	collection.find({}, options, (err, docs) => {
		if (err) {
			logger.log('warn', `user display error ${err}`);
		}
		logger.log('info', 'User is being viewed');
		res.render('users', { userList: docs });
	});
});

router.get('/user', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};
	const loginuserId = req.user._id;
	collection.findOne({ _id: loginuserId }).then(doc => {
		res.render('users', { userList: [doc] });
	});
});

router.get('/delete/:id', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};
	if (req.params.id) {
		collection.findOne({ _id: req.params.id }).then(doc => {
			collection.findOneAndDelete({ _id: req.params.id }).then(doc => {
				req.flash('success_msg', `User Deleted ${req.params.id}`);
			});
		});
	}
	collection.find({}, options, (err, docs) => {
		if (err) {
			logger.log('warn', `user display error ${err}`);
		}
		res.render('users', { userList: docs });
	});
});
router.get('/changerole', (req, res) => {
	// TODO console.log('in change role');
});

router.post('/role', adminlogsAuthenticated, (req, res) => {
	const data = req.body;
	console.log(data);


	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};
	
	

	collection.findOneAndUpdate({ _id: data.id }, { $set: { role: data.role } }).then(updatedDoc => {
		req.flash('success_msg', 'User role updated ');

		res.json({'success':true,'role':data.role});		

	});
	

	
});
router.get('/loc/:id', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};

	if (req.params.id) {
		collection.findOne({ _id: req.params.id }).then(doc => {
			if (doc) {
				res.render('userdetail', { userList: doc });
				// collection
				// 	.findOneAndUpdate({ _id: req.params.id }, { $set: { role: 'admin' } })
				// 	.then(updatedDoc => {
				// 		req.flash('success_msg', `User role updated ${req.params.id}`);
				// 	});
			} else {
				req.flash('error_msg', 'You Need to be Admin to carry out this task');
			}
		});
	}
});

router.post('/save', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};

	//TODO not fully implemented password reset
	//need to be able to check password validity
	//implemented but not tested via api

	let docs = {};
	const id = req.body._id;
	const name = req.body.name;
	const lat = req.body.latitude;
	const lng = req.body.longtitude;
	const password = req.body.password;
	const newpassword1 = req.body.password1;
	const newpassword2 = req.body.newpassword2;

	if (newpassword1 != newpassword2) {
		req.flash('error_msg', '  Passwords do not match');
		//getAllUsers();
	}

	const location = {
		type: 'Point',
		coordinates: [parseFloat(lat), parseFloat(lng)],
	};

	collection.findOne({ _id: id }).then(doc => {
		//TODO logic wrong
		//need to allow  this user or any superuser or any admin to change
		//as it is anyone can change
		//$set: { name: name },

		if (doc.password == doc.password) {
			collection
				.findOneAndUpdate(
					{ _id: id },
					{
						$set: { location: location, name: name },
					}
				)
				.then(updatedDoc => {
					console.log(updatedDoc);
					req.flash('success_msg', `User  updated ${req.params.id}`);
					getAllUsers();
				});
		} else {
			req.flash('error_msg', 'You Need to be Admin to carry out this task');
		}
	});

	function getAllUsers() {
		collection.find({}, options, (err, docs) => {
			if (err) {
				logger.log('warn', `user display error ${err}`);
			}

			res.render('users', { userList: docs });
		});
	}
});

module.exports = router;
