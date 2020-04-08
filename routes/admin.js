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
		sort: { 'timestamp': -1 },
	};
	

	collection
		.find({}, options, (err, docs) => {
			if (err) {
				console.log(err);
				logger.log('warn', `mongodb logs error ${err}`);
			}
			console.log(docs);
			res.render('logs', { loglist: docs });
		});
});

module.exports = router;
