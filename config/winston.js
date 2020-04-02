
const winston = require('winston')
require('winston-mongodb');


const logger = new winston.createLogger({
  transports: [
    new winston.transports.MongoDB({
      db:'mongodb://expressUser:1expressUser@localhost:27717/dswp',
      collection:'apache',
      level:'info',
      options:  { useUnifiedTopology: true },
      capped:true
    })
  ],
  exitOnErrors: false
});

module.exports = logger;
