const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');

const fs = require('fs');
const path = require('path');

const ep = new exiftool.ExiftoolProcess(exiftoolBin);


//convert gps degrees minutes seconds to decimal
function ParseDMS(input) {
    var parts = input.split(/[^\d\w\.]+/);    
    var lat = ConvertDMSToDD(parts[0], parts[2], parts[3], parts[4]);
    var lng = ConvertDMSToDD(parts[5], parts[7], parts[8], parts[9]);

    return {
        Latitude : lat,
        Longitude: lng,
        Position : lat + ',' + lng
    }
}
function ConvertDMSToDD(degrees, minutes, seconds, direction) {   
    var dd = Number(degrees) + Number(minutes)/60 + Number(seconds)/(60*60);

    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
}


module.exports = {
	getImageMetaData: function(req, res, next) {
		console.log(req);
		if (req.isAuthenticated()) {
			return next();
		}

		const PHOTO_PATH = path.join(__dirname, '../public/uploads/' + 'dunes.jpg');
		console.log(PHOTO_PATH);
		const rs = fs.createReadStream(PHOTO_PATH);
		ep.open()
			.then(() => ep.readMetadata(rs, ['-File:all']))
			.then(result => {
				//console.log(res);
				if (result.data) {
					//console.log(res.data)
					if (result.data.length > 0) {
						//console.log(res.data[0])
						if (result.data[0].GPSPosition) {
                            let geodata =ParseDMS(result.data[0].GPSPosition);
                            res.locals.geo = geodata;
                            next();
							
						} else {
                            console.log('No GPSPosition');
                            res.locals.geo = {msg:"No Data"};
                            next();
						}
					}
				} else {
                    console.log('No metadata');
                    res.locals.geo = {msg:"No Data"};
                    next();
				}
			})
			.then(
				() => ep.close(),
				() => ep.close()
			)
			.catch(console.error);

		//req.flash('error_msg', 'Please log in to view that resource');
		//res.redirect('/map');
	},
	getGeolocFromAddress: function(req, res, next) {
        //console.log(req)
        res.locals.msg1 = {'msg1':"Hello from helper"}
        console.log("ih helper function");
        next();
		
	},
};
