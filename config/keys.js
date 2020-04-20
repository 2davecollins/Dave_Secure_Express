const dbconnect = 'mongodb://expressUser:1expressUser@localhost:27717/dswp';
const dblog = 'mongodb://expressUser:1expressUser@localhost:27717/dswp';

const geocoder_provider = 'mapquest';
const geocoder_key = 'AVmgJm14dU0aU6q9';
const secret = 'thebestkeptsecret';
const jwt_secret = 'the bestkeptsecretindublin';
const jwt_expire = '1d';

module.exports = {
	mongoURI: dbconnect,
	mongoLOG: dblog,
	GEOCODER_PROVIDER: geocoder_provider,
	GEOCODER_KEY: geocoder_key,
	SESSION_SECRET: secret,
	JWT_SECRET:jwt_secret,
	JWT_EXPIRE:jwt_expire
};
