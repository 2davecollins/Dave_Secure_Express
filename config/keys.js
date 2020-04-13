//dbPassword = 'mongodb+srv://YOUR_USERNAME_HERE:'+ encodeURIComponent('YOUR_PASSWORD_HERE') + '@CLUSTER_NAME_HERE.mongodb.net/test?retryWrites=true';

// module.exports = {
//     mongoURI: dbPassword
// };

//dbconnect = "mongodb://localhost:27017/usersdb";
const dbconnect = 'mongodb://expressUser:1expressUser@localhost:27717/dswp';

const dblog = 'mongodb://expressUser:1expressUser@localhost:27717/dswp';

const geocoder_provider = 'mapquest';
const geocoder_key = 'AVmgJm14dU0aU6q9';

module.exports = {
	mongoURI: dbconnect,
	mongoLOG: dblog,	
	GEOCODER_PROVIDER: geocoder_provider,
	GEOCODER_KEY: geocoder_key

};
