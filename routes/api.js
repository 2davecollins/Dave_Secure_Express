const express = require('express'),
	router = express.Router(),
	logger = require('express-log-mongo'),
	{ ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Logs
router.get('/logs', ensureAuthenticated, (req, res) => {
	logger
		.retrieveDB({
			find: {},
			sort: { date: -1 },
		})
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			res.status(500).json(err);
		});
});

module.exports = router;
