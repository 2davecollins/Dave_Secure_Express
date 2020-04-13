const options ={

    key: require('fs').readFileSync( __dirname +'/certs/selfsigned.key','utf8'),
    cert: require('fs').readFileSync(__dirname + '/certs/selfsigned.crt','utf8')

} 

 module.exports = options;