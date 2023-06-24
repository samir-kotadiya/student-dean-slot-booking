import winston from 'winston';
import dailyRotateFile from 'winston-daily-rotate-file';
import morgan from 'morgan';
import config from '../config';

// created separate httpLogger because we want to log express request separatly
const httpLogger = winston.createLogger({
  // format: winston.format.simple(),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new dailyRotateFile({
      name: 'info-file',
      filename: './logs/http-%DATE%.log',
      level: 'info',
      json: false,
    }),
  ],
  exitOnError: false
});

// logger to log all other logs type from application to exception
const logger = winston.createLogger({
  // format: winston.format.simple(),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.splat(),
    winston.format.simple()
  ),
  transports: [
    new dailyRotateFile({
      name: 'info-file',
      filename: './logs/info-%DATE%.log',
      level: 'info',
      json: false,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new dailyRotateFile({
      name: 'error-file',
      filename: './logs/error-%DATE%.log',
      level: 'error',
      json: false,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.Console({
      name: 'info',
      json: true,
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      name: 'exception-file',
      filename: `./logs/${config.logger.exceptionLogFileName}.log`,
      json: true,
    })
  ],
  exitOnError: false
});

// appender function to use winston file transport
const stream = {
  write: (message, encoding) => {
    httpLogger.info(message);
  }
};

// morgan is used to capture http log
morgan.format('full', config.logger.httpLogFormat);
// wrapper function act as middleware for express
logger.startHttpLogger = () => {
  return morgan('full', {
    stream
  });
};

export default logger;