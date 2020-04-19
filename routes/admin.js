const monk = require('monk'),
	dbl = require('../config/keys').mongoLOG,
	dblog = monk(dbl),
	logger = require('../config/winston'),
	{ adminlogsAuthenticated } = require('../config/auth');

const express = require('express'),
	router = express.Router();

router.get('/logs', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('apache');
	const options = {
		projection: { _id: 0 },
		sort: { timestamp: -1 },
	};

	collection.find({}, options, (err, docs) => {
		if (err) {
			console.log(err);
			logger.log('warn', `mongodb logs error ${err}`);
		}
		console.log(docs);
		logger.log('info', `logs being viewed`);
		res.render('logs', { loglist: docs });
	});
});

router.get('/users', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};

	collection.find({}, options, (err, docs) => {
		if (err) {
			console.log(err);
			logger.log('warn', `user display error ${err}`);
		}
		console.log(docs);
		logger.log('info', `Usersbeing viewed`);
		res.render('users', { userList: docs });
	});
});

router.get('/delete/:id', adminlogsAuthenticated, (req, res) => {
	//db.collectionName.update({},{$pull:fieldname:{_id:”id to be matched”}},{multi:true})
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};
	if (req.params.id) {
		collection.findOne({ _id: req.params.id }).then(doc => {
			if (doc.role == 'admin') {
				collection.findOneAndDelete({ _id: req.params.id }).then(doc => {
					req.flash('success_msg', `User Deleted ${req.params.id}`);
				});
			} else {
				req.flash('error_msg', 'You Need to be Admin to carry out this task');
			}
		});
	}
	collection.find({}, options, (err, docs) => {
		if (err) {
			console.log(err);
			logger.log('warn', `user display error ${err}`);
		}
		
		res.render('users', { userList: docs });
	});
});

router.get('/role/:id', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};

	if (req.params.id) {
		collection.findOne({ _id: req.params.id }).then(doc => {
			if (doc.role == 'admin') {
				collection
					.findOneAndUpdate({ _id: req.params.id }, { $set: { role: 'superuser' } })
					.then(updatedDoc => {
						console.log(updatedDoc);
						req.flash('success_msg', `User role updated ${req.params.id}`);
					});
			} else {
				req.flash('error_msg', 'You Need to be Admin to carry out this task');
				console.log('Not admin');
			}
		});
	}
	collection.find({}, options, (err, docs) => {
		if (err) {
			console.log(err);
			logger.log('warn', `user display error ${err}`);
		}
		//console.log(docs);
		//logger.log('info', `Usersbeing viewed`);
		res.render('users', { userList: docs });
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
				//if (doc.role == 'admin') {
				res.render('userdetail', { userList: doc });

				// collection
				// 	.findOneAndUpdate({ _id: req.params.id }, { $set: { role: 'superuser' } })
				// 	.then(updatedDoc => {
				// 		console.log(updatedDoc);
				// 		req.flash('success_msg', `User role updated ${req.params.id}`);
				// 	});
			} else {
				req.flash('error_msg', 'You Need to be Admin to carry out this task');
				console.log('Not admin');
			}
		});
	}
	collection.find({}, options, (err, docs) => {
		if (err) {
			logger.log('warn', `user display error ${err}`);
		}
		//console.log(docs);
		//logger.log('info', `Usersbeing viewed`);
		//res.render('users', { userList: docs });
	});
});

router.post('/save/', adminlogsAuthenticated, (req, res) => {
	const collection = dblog.get('users');
	const options = {
		projection: {},
		sort: { createdOn: -1 },
	};

	const id = req.body._id;
	const name = req.body.name;
	const lat = req.body.latitude;
	const lng = req.body.longtitude;

	console.log(`${id} ${lat} ${lng}`);

	const location = {
		type: 'Point',
		coordinates: [parseFloat(lat), parseFloat(lng)],
	};	

	collection.findOneAndUpdate({ _id: id }, { $set: { location: location } }).then(updatedDoc => {
		console.log(updatedDoc);
		req.flash('success_msg', `${name} details were updated `);
		logger.log('warn', `${name} details updated`);
	});

	collection.find({}, options, (err, docs) => {
		if (err) {
			logger.log('warn', `user display error ${err}`);
		}
		//console.log(docs);
		//logger.log('info', `Usersbeing viewed`);
		res.render('users', { userList: docs });
	});
});

module.exports = router;
