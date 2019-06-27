const { createLogger, format, transports } = require('winston');
const path = require('path');

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:ss:mm'
    }),
    format.printf(log => `${log.timestamp} ${log.level}: ${log.message}`)
  ),
  transports: [
    new transports.File({ filename: path.join('/var/www', 'logInfo.log') })
  ]
});
module.exports = logger;