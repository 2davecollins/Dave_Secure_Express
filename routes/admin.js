const monk = require('monk'),
    dbl = require('../config/keys').mongoLOG,
    dblog = monk(dbl),
    logger = require('../config/winston'),
    { adminlogsAuthenticated } = require('../config/auth');

const express = require('express'),
    router = express.Router();



router.get('/logs', adminlogsAuthenticated, (req, res) => {
    const  collection = dblog.get('apache');
    collection.find({},{}, (err,docs) =>{
       if(err){
           console.log(err);
           logger.log('warn',`mongodb logs error ${err}`);
       }
        res.render('logs',{
            "loglist": docs
        })
    })
    
});


module.exports = router;