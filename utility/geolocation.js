'use strict';
const fs = require('fs'),
	path = require('path'),
	fetch = require('node-fetch');

function getAppdressFromIP(ip) {
	const url = `http://free.ipwhois.io/json/${ip}`;
	console.log(url)
	return fetch(url).then(res => res.json())       
				.catch(err => console.log(err));
}

function getLatLonFromAddr(addr) {
    const url = `https://nominatim.openstreetmap.org/search?q=${addr}&format=geojson`;
    console.log(addr);
    return fetch(url).then(res => res.json())       
        		.catch(err => console.log(err));
	
}
function getAddressFromLatLng(coord) {	
	const lat = parseFloat(coord.latitude);
	const lng = parseFloat(coord.longtitude);	
	const url = `https://nominatim.openstreetmap.org/reverse?format=geojson&lat=${lat}&lon=${lng}`;
	return fetch(url).then(res => res.json());
}

module.exports = {
	getLatLonFromAddress: async address => {
        let result;  
		try {
			//address = '291+captains+road+crumlin+dublin+12';
			result = await getLatLonFromAddr(address);
			// res.locals.geocode = result.features[0];
			
			//console.log(await result);
			return result;
		
		} catch (err) {
			console.log('fetch error ',err);
			return {msg:'faile to get result',statusCode:400}
		}
	},
	getAddressFromLatLng: async coord => {
        let result ={message:"fail",status:400};
		try {
			let result = await getAddressFromLatLng(coord);
			return result;
		} catch (err) {
			
            //console.log(err);
            return result;
		}
	},
	getLatLngFromIp: async function(ip) {
        let result ={success:false,status:400};
		try {
			result = await getAppdressFromIP(ip);
			return result;
		} catch (err) {
            console.log(err);
			return result;
		}
	},
};
