const fs = require('fs'),
    mongoose = require('mongoose'),
    colors = require('colors'),
    dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Store = require('./models/Store');
const User = require('./models/User');

const dbs = require('./config/keys').mongoURI;
// Connect to DB
mongoose.connect(dbs, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

// Read JSON files
const stores = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/stores.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);


// Import into DB
const importData = async () => {
  console.log("Import  Data");
  try {
    await Store.create(stores);   
    await User.create(users);   
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  console.log("Delete database")
  try {
   // await Store.deleteMany();   
    await User.deleteMany();  
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
