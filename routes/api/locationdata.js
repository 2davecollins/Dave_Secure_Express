const express = require('express'),
	router = express.Router(),
	logger = require('express-log-mongo'),
	{ ensureAuthenticated, forwardAuthenticated } = require('../../config/auth');
let markers = [

    [53.291, -6.4382],     
    [53.300, -6.439],
    [53.301, -6.2488],
    [53.305, -6.2487]

]
   
    

router.get('/loc', (req, res) => {

    res.json(markers)

});

module.exports = router;