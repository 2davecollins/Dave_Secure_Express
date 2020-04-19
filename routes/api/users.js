const express = require('express');
const {	getUser, getUsers } = require('../../Controllers/users');

const User = require('../../models/User');
const router = express.Router();

router
	.route('/')
	.get(getUsers);	

router
	.route('/:id')
	.get(getUser);


module.exports = router;
