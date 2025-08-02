const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define colorized format for console
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  })
);

// Define format for file logs
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

// Create logger
const logger = winston.createLogger({
  level: 'info',
  transports: [
    // Console transport with colors
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug' // Show all logs in console
    }),
    
    // File transport for all logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'app.log'),
      format: fileFormat,
      options: { flags: 'a' }
    }),
    
    // Separate file for error logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      format: fileFormat,
      level: 'error',
      options: { flags: 'a' }
    }),
    
    // Separate file for auth logs
    new winston.transports.File({ 
      filename: path.join(logsDir, 'auth.log'),
      format: fileFormat,
      level: 'info',
      options: { flags: 'a' }
    })
  ]
});

// Override console methods to use our logger
console.log = (message) => logger.info(message);
console.info = (message) => logger.info(message);
console.warn = (message) => logger.warn(message);
console.error = (message) => logger.error(message);
console.debug = (message) => logger.debug(message);

// Add a simple test log to verify logger is working
logger.info('Logger initialized');

module.exports = logger;
