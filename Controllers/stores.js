const path = require('path'),        
	Store = require('../models/Store');
	
const { ErrorResponse } = require('../utility/errorResponse');
const { asyncHandler } = require('../utility/helper');
    

// @desc      Get all Stores
// @route     GET /api/v1/stores
// @access    Public
// exports.getStores = asyncHandler(async (req, res, next) => {
	
// 	const stores = await Store.find();
// 	res.status(200).json({success:true,count:stores.length,data:stores});
// 	//res.status(200).json(res.filteredResults);
// });

exports.getStores = asyncHandler(async (req, res, next) => {
	
	//res.status(200).json(res.filteredResults);
	res.status(200).json(res.filteredResults);
});



// @desc      Get single Store
// @route     GET /api/v1/stores/:id
// @access    Public
exports.getStore = asyncHandler(async (req, res, next) => {
	const store = await Store.findById(req.params.id);

	if (!store) {
		return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
	}
	res.status(200).json({ success: true, data: store });
});



// @desc      Create new Store
// @route     POST /api/v1/stores
// @access    Private
exports.createStore = asyncHandler(async (req, res, next) => {
	// Add user to req,body
	req.body.user = req.user.id;

	// Check for existing store
	//   const existingStore = await Store.findOne({ user: req.user.id });

	//   // If the user is not an admin, they can only add one bootcamp
	//   if (publishedBootcamp && req.user.role !== 'admin') {
	//     return next(
	//       new ErrorResponse(
	//         `The user with ID ${req.user.id} has already published a bootcamp`,
	//         400
	//       )
	//     );
	//   }

	const store = await Store.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

// @desc      Update Store
// @route     PUT /api/v1/store/:id
// @access    Private
exports.updateStore = asyncHandler(async (req, res, next) => {
	let store = await Store.findById(req.params.id);

	if (!store) {
		return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
	}

	// // Make sure user is store owner
	// if (store.user.toString() !== req.user.id && req.user.role !== 'admin') {
	// 	return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
	// }

	store = await Store.findOneAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ success: true, data: bootcamp });
});

// @desc      Delete Store
// @route     DELETE /api/v1/store/:id
// @access    Private
exports.deleteStore = asyncHandler(async (req, res, next) => {
	const store = await Store.findById(req.params.id);

	if (!store) {
		return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
	}
	store.remove();

	res.status(200).json({ success: true, data: {} });
});

// @desc      Get store within a radius
// @route     GET /api/v1/stores/radius/:zipcode/:distance
// @access    Private
exports.getStoresInRadius = asyncHandler(async (req, res, next) => {
    const { coord, distance } = req.params;
    console.log(req.parms);

	// Get lat/lng from geocoder
	// const loc = await geocoder.geocode(zipcode);
	// const lat = loc[0].latitude;
	// const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 6378;

	const stores = await Store.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: stores.length,
		data: stores,
	});
});

// @desc      Upload photo for Store
// @route     PUT /api/v1/stores/:id/photo
// @access    Private
exports.storePhotoUpload = asyncHandler(async (req, res, next) => {
	const store = await Store.findById(req.params.id);

	if (!store) {
		return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
	}
	//TODO

	// // Make sure user is store creater
	// if (store.user.toString() !== req.user.id && req.user.role !== 'admin') {
	// 	return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
	// }

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	// Make sure the image is a photo
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload an image file`, 400));
	}

	// Check filesize
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400));
	}

	// Create custom filename
	file.name = `photo_${store._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
		if (err) {
			console.error(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		await Store.findByIdAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
});
