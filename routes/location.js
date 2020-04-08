const express = require('express'),
	multer = require('multer'),
	path = require('path'),
	router = express.Router();

let loginstate = false;
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

router.get('/', (req, res) =>
	res.render('map', {
		user: req.user,
	})
);
router.get('/add_location', ensureAuthenticated, (req, res) =>
	res.render('location', {
		user: req.user,
	})
);

router.post('/add_location', ensureAuthenticated, (req, res) => {
    console.log('post in location');
   
	upload(req, res, err => {
		if (err) {
			res.render('location', {
				msg: err,
                user: req.user,
                file: req.file
			});
		} else {
			console.log('in location');
			console.log(req.file);
			if (req.file == undefined) {
				res.render('location', {
					msg: 'Error: No File Selected!',
					user: req.user,
				});
				req.flash('error_msg', 'No File Selected');
			} else {
				req.flash('success_msg', 'File uploaded');
				res.render('map', {
					msg: 'File Uploaded!',
					user: req.user,
					file: `uploads/${req.file.filename}`,
				});
			}
		}
	});
});

module.exports = router;
