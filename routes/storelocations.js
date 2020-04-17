const express = require('express'),
	router = express.Router(),
	logger = require('express-log-mongo'),
	{ ensureAuthenticated, forwardAuthenticated } = require('../config/auth'),
	ErrorResponse = require('../utility/errorResponse'),    
    Store = require('../models/Store');

const { asyncHandler } = require('../utility/helper');


// Get all Logs sort descending order
router.get('/', async (req, res) => {
	try{
		let storeList =  await Store.find().sort({name: 1});
		
		res.status(200).render('stores',{storeList});
	}catch(err){
		//console.log(err)		
	}
});

// DELETE USER using a get request for ejs
router.get('/delete/:id', async (req, res, next) => {
	try{
		const store = await Store.findById(req.params.id);	
		if (!store) {
			req.flash('error', err)
			return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
		}
		store.remove();
		req.flash('success_msg', 'Store Deleted');

	}catch(err){
		req.flash('error', err)
		console.log(err);
	}
	res.redirect('/storelocation');    
});

// edit store data
router.get('/edit/:id', async (req, res, next) => {

	console.log(`edt ${req.params.id}`);
	

	try{
		const store = await Store.findById(req.params.id);	
		if (!store) {
			req.flash('error', err)
			return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));
		}
		//store.remove();
	}catch(err){
		return next(new ErrorResponse(`Store not found with id of ${req.params.id}`, 404));

	}	
	res.redirect('/storelocation/storedetail');    
});

router.get('/storedetail', async (req, res) => {
	try{
		//let storeList =  await Store.find().sort({name: 1});
		
		res.status(200).render('storedetail');
	}catch(err){
		//console.log(err)		
	}
});




module.exports = router;
