const   path = require('path'),        
	    User = require('../models/User'),        
        { asyncHandler } = require('../utility/helper'),    
        { ErrorResponse } = require('../utility/errorResponse');


// @desc      Get all users
// @route     GET /api/v1/users
// @access    Public
exports.getUsers = asyncHandler(async (req, res, next) => {   

    await User.find({}, function(err, docs) {
        if(err){
            return next(new ErrorResponse(`users not found`, 404));
        }       
        let filteredData =[];
        docs.forEach(function(doc) {            
            filteredData.push( {
                name: doc.name,
                location:doc.location,
                role:doc.role
            });  
        });      
        res.status(200).json({data: filteredData});            
    })
});

// @desc      Get single User
// @route     GET /api/v1/users/:id
// @access    Public
exports.getUser = asyncHandler(async (req, res, next) => {
    //const user = await User.findById(req.params.id);
    await User.findOne({_id:req.params.id}, (err, doc) =>{
        if(err){
            return next(new ErrorResponse(`user not found with id of ${req.params.id}`, 404));
        } 
        const data = {
            name: doc.name,
            location:doc.location,
            role:doc.role         
        }      
        res.status(200).json({ data: data });
    })
});


// @desc      Get user within a radius
// @route     GET /api/v1/users/radius/:zipcode/:distance
// @access    Private
exports.getUsersInRadius = asyncHandler(async (req, res, next) => {
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

	const users = await User.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: users.length,
		data: users,
	});
});
