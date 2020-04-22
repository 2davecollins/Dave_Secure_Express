const express = require('express'),
	router = express.Router();	

let markers = require('../../models/_datamarkers');

//used to provide dummy data for map kept for testing

router.get('/loc', (req, res) => {
	res.json(markers);
});

module.exports = router;
