/* eslint-disable no-unused-vars */
const express = require('express'),
	multer = require('multer'),
	path = require('path'),
	router = express.Router();

//file upload
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

let loginstate = false;
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
	res.render('dashboard', {
		user: req.user,
	})
);

router.post('/dashboard', (req, res) => {
	console.log('post in dashboard');
	upload(req, res, err => {
		if (err) {
			res.render('dashboard', {
				msg: err,
				user: req.user,
			});
		} else {
			
			if (req.file == undefined) {
				res.render('dashboard', {
					msg: 'Error: No File Selected!',
					user: req.user,
				});
				req.flash('error_msg', 'No File Selected');
			} else {
				req.flash('success_msg', 'File uploaded');
				res.render('dashboard', {
					msg: 'File Uploaded!',
					user: req.user,
					file: `uploads/${req.file.filename}`,
				});
			}
		}
	});
});

module.exports = router;
