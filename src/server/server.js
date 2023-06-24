import http from 'http';
import express from 'express';
import logger from './utils/logger';
import config from './config';
import middlewares from './middlewares';

const startServer = async () => {
  const app = express();

  /* initialize all app and middlewares */
  await middlewares(app, express);

  const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  };

  // Event listener for HTTP server "error" event.
  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ?
      `Pipe ${port}` :
      `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  // Create HTTP server.
  const server = http.createServer(app);

  // Event listener for HTTP server "listening" event.
  const onListening = () => {
    const addr = server.address();
    const bind = typeof addr === 'string' ?
      `pipe ${addr}` :
      `port ${addr.port}`;
    logger.info(`[server] Listening on ${bind}`);
  };

  // Get port from environment and store in Express.
  const port = normalizePort(config.port);
  app.set('port', port);

  // Listen on provided port, on all network interfaces.
  server.on('error', onError);
  server.on('listening', onListening);
  server.listen(port);
};

startServer();

process.on('unhandledRejection', (error) => {
  console.log(error);
  logger.error(`unhandledRejection: ${error}`);
  // process.exit(1);
});

process.on('multipleResolves', (type, promise, reason) => {
  //logger.error(`multipleResolves:  ${type}, ${promise}, ${reason}`);
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
  logger.error(`unhandledRejection:  ${reason}, ${promise}`);
  // process.exit(1);
});

process.on('uncaughtException', (error, origin) => {
  console.log(error)
  logger.error(`uncaughtException: ${error}, ${origin}`);
});

/* process.on('SIGINT', () => {
  logger.info('Received SIGINT. Press Control-D to exit.');
}); */