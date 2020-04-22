/* eslint-disable no-unused-vars */
const express = require('express'),
	router = express.Router(),
	{ getUser, getUsers } = require('../../Controllers/users'),
	User = require('../../models/User'),
	errorResponse = require('../../utility/errorResponse'),
	{ protect, authorize } = require('../../middleware/auth'),
	filterResults = require('../../middleware/filterResults');

router
	.route('/')
	.get(getUsers);	

router
	.route('/:id')
	.get(getUser);


module.exports = router;
