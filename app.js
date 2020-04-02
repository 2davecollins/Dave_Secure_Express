const express = require('express'),
  expressLayouts = require('express-ejs-layouts'),
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  session = require('express-session'),
  logger = require('./config/winston');

//init app
const app = express();

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;


// Connect to MongoDB
mongoose
  .connect(db,{ useNewUrlParser: true , useUnifiedTopology: true})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));



// logger


app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));



// Express session
app.use( session({ secret: 'secret', resave: true, saveUninitialized: true}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.locals.loginstate = false;

// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/public', require('./routes/public.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/api', require('./routes/api.js'));




const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
  console.log(`server startedon port ${PORT}`);
  //logger.info(`Server started on port ${PORT}`);
});
