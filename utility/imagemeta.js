const exiftool = require('node-exiftool');
const exiftoolBin = require('dist-exiftool');

const fs = require('fs');
const path = require('path');

const ep = new exiftool.ExiftoolProcess(exiftoolBin);

exports.getData = (image) => {
	const PHOTO_PATH = path.join(__dirname, '../public/uploads/'+image);
	console.log(PHOTO_PATH);
	const rs = fs.createReadStream(PHOTO_PATH);
	ep.open()
		.then(() => ep.readMetadata(rs, ['-File:all']))
		.then(res => {
			//console.log(res);			
			if(res.data){
				//console.log(res.data)
				if(res.data.length >0 ){
					//console.log(res.data[0])
					if(res.data[0].GPSPosition){
						console.log( ParseDMS(res.data[0].GPSPosition))
						return ParseDMS(res.data[0].GPSPosition)
					}else{
						console.log("No GPSPosition");
					}
				}
			}else{
				console.log("No metadata");
			}
		
		})
		.then(
			() => ep.close(),
			() => ep.close()
		)
		.catch(console.error);
};

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

