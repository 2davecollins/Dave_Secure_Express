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

const filterResults = require('../../middleware/filterResults');

// router.use('/:bootcampId/courses', courseRouter);
// router.use('/:bootcampId/reviews', reviewRouter);

// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

// router
// 	.route('/')
// 	.get(advancedResults(Store, 'courses'), getStores)
// 	.post(protect, authorize('publisher', 'admin'), createStore);

// router
// 	.route('/:id')
// 	.get(getStore)
// 	.put(protect, authorize('publisher', 'admin'), updateStore)
//     .delete(protect, authorize('publisher', 'admin'), deleteStore);


    

router
	.route('/')
	.get(filterResults(Store),getStores)
	.post(createStore);

router
	.route('/:id')
	.get(getStore)
	.put(updateStore)
	.delete(deleteStore);


module.exports = router;
