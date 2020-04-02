//dbPassword = 'mongodb+srv://YOUR_USERNAME_HERE:'+ encodeURIComponent('YOUR_PASSWORD_HERE') + '@CLUSTER_NAME_HERE.mongodb.net/test?retryWrites=true';

// module.exports = {
//     mongoURI: dbPassword
// };

//dbconnect = "mongodb://localhost:27017/usersdb";
dbconnect = 'mongodb://expressUser:1expressUser@localhost:27717/dswp';

dblog = 'mongodb://expressUser:1expressUser@localhost:27717/dswp';

module.exports = {
    mongoURI: dbconnect,
    mongoLOG: dblog
};