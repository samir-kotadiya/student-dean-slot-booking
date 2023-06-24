import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
  // This error should crash whole process
  throw new Error("Couldn't find .env file");
}

export default {
  env: 'test',
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT, 10),

  /**
   * server settings
   */
  server: {
    enableHttpLogs: true,
  },

  /**
   * database configs
   */
  db: {
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'veemo_talk',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'root',
    dialect: 'postgres',
  },

  /**
   * Your secret sauce
   */
  jwtSecret: process.env.SECRET_KEY,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * API configs
   */
  api: {
    prefix: '/v1',
  },

  logger: {
    exceptionLogFileName: 'exception',
    logFileSize: 5242880,
    httpLogFormat: ':remote-addr - :remote-user [:date] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"',
  },

  /**
   * defailt user password
   */
  defaultPassword: '12345',

  pagination: {
    page: 1,
    limit: 20
  },

  /**
   * set white listed api with api prefix
   */
  whiteListApi: [
    '/v1/users/login',
    '/v1/users/register',
  ],

  publicDir: process.env.PUBLIC_DIR,
  uploadDir: process.env.UPLOAD_DIR,
  tempDir: process.env.TEMP_DIR,

  timezone: 'UTC',
};