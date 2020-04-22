/* eslint-disable no-unused-vars */
const {
	getStores,
	getStore,
	createStore,
	updateStore,
	deleteStore,
	getStoresInRadius,
	StorePhotoUpload,
} = require('../../Controllers/stores');

const express = require('express'),
	Store = require('../../models/Store'),
	router = express.Router(),
	errorResponse = require('../../utility/errorResponse'),
	{ protect, authorize } = require('../../middleware/auth'),
	filterResults = require('../../middleware/filterResults');

router
	.route('/')
	.get(filterResults(Store), getStores)
	.post(protect, createStore);

router
	.route('/:id')
	.get(getStore)
	.put(protect, updateStore)
	.delete(protect, deleteStore);

module.exports = router;
