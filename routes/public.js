/* eslint-disable no-unused-vars */
const express = require('express'),
	router = express.Router();

const ErrorResponse = require('../utility/errorResponse');

router.get('/blog', (req, res) => {
	
	res.render('blog');
});

module.exports = router;
