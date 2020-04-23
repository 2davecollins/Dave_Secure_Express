/* eslint-disable no-unused-vars */
'use strict';
const express = require('express'),
	router = express.Router(),
	bodyParser = require('body-parser'),
	path = require('path'),
	logger = require('../config/winston'),
	{ ensureAuthenticated, forwardAuthenticated } = require('../config/auth'),
	{ ErrorResponse, asyncHandler } = require('../utility/errorResponse'),
	Store = require('../models/Store');

//TODO add authentication move to multer to middleware

const multer = require('multer');
const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
	fileFilter: function(req, file, cb) {
		checkFileType(file, cb);
	},
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png|gif/;
	// Check ext
	const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);
	console.log(file);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		//logger.log('warn', `Attempt to upload file not image`);
		return cb(new Error('Not an image'));
	}
}
// Use body parser for file upload
router.use(bodyParser.json()).use(
	bodyParser.urlencoded({
		extended: true,
	})
);

// Get all Stores sort descending order
router.get('/', async (req, res) => {
	try {
		let storeList = await Store.find().sort({ name: 1 });
		res.status(200).render('stores', { storeList });
	} catch (err) {
		logger.log('warn', `mongodb logs error ${err}`);
	}
});

//Text Search for any store name address

router.get('/search', async (req, res) => {
	const search = req.query.search;
	
	try {
		let storeList = await Store.find({ $text: {$search: `${search}` } }).sort({ name: 1 });
		res.status(200).render('stores', { storeList });
	} catch (err) {
		logger.log('warn', `mongodb logs error ${err}`);
	}
});

// DELETE USER using a get request for ejs
router.get('/delete/:id', async (req, res, next) => {
	try {
		const store = await Store.findById(req.params.id);
		if (!store) {
			req.flash('error', 'Problem Deleting User');
			logger.log('warn', 'delete user error');
			return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
		}
		store.remove();
		req.flash('success_msg', 'Store Deleted');
		logger.log('info', `${req.params.id} deleted`);
	} catch (err) {
		req.flash('error', err);
		logger.log('warn', `logs delete error ${err}`);		
	}
	res.redirect('/storelocation');
});

// edit store data
router.get('/edit/:id', async (req, res, next) => {
	try {
		const store = await Store.findById(req.params.id);
		res.render('storedetail', store);
		if (!store) {
			req.flash('error', 'store not found');
			logger.log('warn','store no found');
			return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
		}
	} catch (err) {
		req.flash('error');
		const store = {
			name: '',
			location: {
				road: '',
				city: '',
				county: '',
				country: '',
				coordinates: [],
			},
		};
		logger.log('warn', `${err}`);
		res.render('storedetail', store);
	}
});

router.post('/save', upload, async (req, res, next) => {
	
	
	try {
		let image = 'none';
		if(req.file){
			console.log(req.file.filename);
			image = req.file.filename;
		}
		let newData = {
			location: {
				type: 'Point',
				coordinates: [parseFloat(req.body.latitude), parseFloat(req.body.longtitude)],
				road: req.body.road || ' ',
				city: req.body.city || ' ',
				county: req.body.county || ' ',
				country: req.body.country || ' ',
			},
			name: req.body.name || ' ',
			createdOn: Date.now(),
			image: image,
			edit: false,
		};
		
		const filter = { _id: req.body._id };
		const store = await Store.findOneAndUpdate(filter, newData, {
			new: true,
			runValidators: true,
		});
		// get updated list of stores
		const storeList = await Store.find().sort({ name: 1 });
		logger.log('info', `store modified ${req.body._id}`);
		res.status(200).render('stores', { storeList });
	} catch (err) {
		logger.log('warn', `store post ${err}`);
	}

});

module.exports = router;
