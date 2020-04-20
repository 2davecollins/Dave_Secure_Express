const express = require('express');

const {
	getStores,
	getStore,
	createStore,
	updateStore,
	deleteStore,
	getStoresInRadius,
	StorePhotoUpload,
} = require('../../Controllers/stores');

const Store = require('../../models/Store');
const router = express.Router();
const errorResponse = require('../../utility/errorResponse');
const { protect, authorize } = require('../../middleware/auth');
const filterResults = require('../../middleware/filterResults');


router
	.route('/')
	.get(filterResults(Store),getStores)
	.post(protect,createStore);

router
	.route('/:id')
	.get(getStore)
	.put(protect,updateStore)
	.delete(protect,deleteStore);


module.exports = router;
