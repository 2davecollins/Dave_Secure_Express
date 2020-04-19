const express = require('express'),
	expressLayouts = require('express-ejs-layouts'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	errorHandler = require('./middleware/errorResponse'),
	session = require('express-session'),
	logger = require('./config/winston'),
	http = require('http'),
	https = require('https');

//init app
const app = express();

const options = require('./config/local.js');

// Passport Config
require('./config/passport')(passport);
const secret = require('./config/keys').SESSION_SECRET;

// DB Config
const db = require('./config/keys').mongoURI;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
// Connect to MongoDB
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true , useFindAndModify: false,useCreateIndex: true})
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

// logger
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret, resave: true, saveUninitialized: true }));
app.use(express.static("public"));

// Connect flash
app.use(flash());
// Global variables
app.use(function( req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	next();
});
app.locals.loginstate = false;

// Express session


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/public', require('./routes/public.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/location', require('./routes/location'));
app.use('/storelocation', require('./routes/storelocations'));
app.use('/map', require('./routes/map.js'));
app.use('/log', require('./routes/log.js'));
app.use('/api', require('./routes/api/locationdata.js'));

app.use('/api/vi/stores', require('./routes/stores'));

//use custom error handler
app.use(errorHandler);


// error and page not found to prevent stack trace

app.use('/*',(req,res) =>{
	res.status(404).render('404',{title:'Oooops sorry page not found . . . . ', image:'/images/error.jpeg'});
});

//const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
// 	console.log(`server startedon port ${PORT}`);
// 	//logger.info(`Server started on port ${PORT}`);
// });

// needs to be run as sudo

http.createServer(app).listen(80);
https.createServer(options,app).listen(443)