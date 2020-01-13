const winston = require('winston');
const { format } = require('logform');
const { combine, timestamp, label, prettyPrint, printf } = format;
const path = require('path');

const getLabel = function(callingModule) {
    const parts = callingModule.filename.split(path.sep);
    return path.join(parts[parts.length - 2], parts.pop());
  };

module.exports = function (callingModule) {
    const myFormat = printf(({ level, message, label, timestamp, stack }) => {
        return `\n${timestamp} [${label}] ${level}: ${message} - ${stack}`;
      });

    var logger = winston.createLogger({
        level: 'info',
        
        format: combine(
            label({label:getLabel(callingModule)}),
            format.errors({ stack: true }),
            timestamp(),
            prettyPrint(),
            myFormat
          ),
        transports: [
          new winston.transports.File({ filename: 'error.log', level: 'error' }),
          new winston.transports.File({ filename: 'combined.log', level:'info' })
        ]
    });


    // if (process.env.NODE_ENV == 'development') {
    //     logger.clear().add(new winston.transports.Console({
    //         label: getLabel(callingModule),
    //         format: winston.format.simple()
    //     }));
    // }

    return logger;
};


