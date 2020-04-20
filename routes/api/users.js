const express = require('express');
const {	getUser, getUsers } = require('../../Controllers/users');

const User = require('../../models/User');
const router = express.Router();

const errorResponse = require('../../utility/errorResponse');
const { protect, authorize } = require('../../middleware/auth');
const filterResults = require('../../middleware/filterResults');

router
	.route('/')
	.get(getUsers);	

router
	.route('/:id')
	.get(getUser);


module.exports = router;
