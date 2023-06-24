import bodyParser from 'body-parser';
import cors from 'cors';
import config from '../config';
import logger from '../utils/logger';
import routesLoader from '../routes';
import dbLoader from '../models';
import auth from './auth';

export default async (app, express) => {
  // load database globally
  global.db = await dbLoader(); // load all model and db connestion and store it in global scope

  // Enable http logging
  if (config.server.enableHttpLogs) {
    app.use(logger.startHttpLogger());
  }

  /**
   * Health Check endpoints
   * 
   */
  app.get('/status', (req, res) => {
    res.status(200).send('OK');
  });
  app.head('/status', (req, res) => {
    res.status(200).send('HEAD OK');
  });

  // serve static files
  app.use('/public', express.static('public'));

  // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  // It shows the real origin IP in the heroku or Cloudwatch logs
  app.enable('trust proxy');

  // The magic package that prevents frontend developers going nuts
  // Alternate description:
  // Enable Cross Origin Resource Sharing to all origins by default
  app.use(cors());

  // Middleware that transforms the raw string of req.body into json
  app.use(bodyParser.json({
    limit: '5mb'
  }));

  app.use(bodyParser.urlencoded({
    extended: true,
    limit: '5mb'
  })); // support encoded bodies  

  app.use(auth); // Initialise authentication middelware

  // Load API routes
  app.use(config.api.prefix, await routesLoader(express));

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res
        .status(err.status)
        .send({
          message: err.message
        })
        .end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};