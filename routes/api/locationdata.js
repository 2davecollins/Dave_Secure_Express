const express = require('express'),
	router = express.Router(),
	logger = require('express-log-mongo'),
	{ ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');
let markers = require('../../models/_datamarkers')
   
    

router.get('/loc', (req, res) => {

    res.json(markers)

});

module.exports = router;