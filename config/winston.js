
const winston = require('winston')
require('winston-mongodb')

const logger = new winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      db:'mongodb://localhost:27017/dblog',
      collection:'apache',
      level:'info',
      capped:true
    })
  ],
  exitOnErrors: false
});

module.exports = logger;
