const express = require('express');
const router = express.Router();
const logger = require('express-log-mongo');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Logs
router.get('/logs',ensureAuthenticated,  (req,res) =>{

    logger.retrieveDB({

        find:{},
        sort:{ 'date': -1}
    }).then((results) =>{
        res.json(results);
    }).catch((err) => {
        res.status(500).json(err)
    });
});

module.exports = router;
