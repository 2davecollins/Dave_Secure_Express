const express = require('express'),
  router = express.Router();

  //getAPI_KEY = () => '556e345dbb8e85c073a5dde9e4df820b';
  //getURLMap = () => 'https://tile.openweathermap.org/map/';

 

router.get('/',  (req, res) => {
     
  res.render('map');
});


module.exports = router;