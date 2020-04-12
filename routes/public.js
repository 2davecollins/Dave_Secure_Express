const express = require('express'),
	router = express.Router();

const ErrorResponse = require('../utility/errorResponse');

router.get('/blog', (req, res) => {
	const c = false;
	console.log(`in blog ${c}`);
	
	if(c == false){
		console.log("error response");
		const message = `Resource not found`;
		error = new ErrorResponse(message, 404);
	}
	res.render('blog');
});

module.exports = router;
