/* eslint-disable no-unused-vars */
'use strict';
const express = require('express'),
	multer = require('multer'),
	path = require('path'),
	router = express.Router(),
	Store = require('../models/Store'),
	logger = require('../config/winston');


const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const storage = multer.diskStorage({
	destination: './public/uploads/',
	filename: function(req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
	},
});

// Init Upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 1000000 },
	fileFilter: function(req, file, cb) {
		checkFileType(file, cb);
	},
}).single('myImage');

// TODO move to middleware helper

async function getStores() {
	try {
		return await Store.find().sort({ name: 1 });
	} catch (err) {
		logger.log('warn', `mongodb logs error ${err}`);
	}
}
async function getStore(id) {
	try {
		return await Store.findOne({ _id: id });
	} catch (err) {
		logger.log('warn', `mongodb logs error ${err}`);
	}
}

async function createStore(newStore) {
	try {
		return await Store.create(newStore);
	} catch (err) {
		logger.log('warn', `mongodb logs error ${err}`);
	}
}

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
		cb('Error: Images Only!');
	}
}

router.get('/', (req, res) => {
	res.render('map', {
		user: req.user,
	});
});

router.post('/new_location/', async (req, res) => {
	const store = req.body;
	await Store.create(store);
	const storeList = await getStores();
	res.status(200).render('stores', { storeList });
});

router.get('/add_location', ensureAuthenticated, (req, res) =>
	res.render('location', {
		user: req.user,
	})
);

router.get('/show_stores', async (req, res) => {
	try {
		const storeList = await getStores();
		res.status(200).render('stores', { storeList });
	} catch (err) {
		logger.log('warn', `${err}`);
	}
});

router.post('/add_location', async (req, res) => {
	const { name, address } = req.body;

	const storeList = await getStores();
	res.status(200).render('stores', { storeList });

	// upload(req, res, err => {
	// 	if (err) {
	// 		res.render('location', {
	// 			msg: err,
	// 			user: req.user,
	// 			file: req.file,
	// 			store: store
	// 		});
	// 	} else {
	// 		console.log('in location');
	// 		console.log(req.user);

	// 		if (req.file == undefined) {
	// 			res.render('location', {
	// 				msg: 'Error: No File Selected!',
	// 				user: req.user,
	// 				store:store
	// 			});
	// 			req.flash('error_msg', 'No File Selected');
	// 		} else {
	// 			req.flash('success_msg', 'File uploaded');
	// 			res.render('stores', {
	// 				msg: 'File Uploaded!',
	// 				user: req.user,
	// 				file: `uploads/${req.file.filename}`,
	// 				storeList: storelist
	// 			});
	// 		}
	// 	}
	// });
});


module.exports = router;
