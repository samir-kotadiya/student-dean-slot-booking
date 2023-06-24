import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';
import logger from '../utils/logger';

//load all moded dynamically 
export default async () => {
  const db = {};

  logger.info('creating db connection ...');
  let sequelize = new Sequelize(config.db.database, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect, // one of 'mysql' | 'mariadb' | 'postgres' | 'mssql'
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: true
  });

  // Testing the connection
  await sequelize.authenticate().then(() => {
    logger.info('database connection has been established successfully.');
  }).catch((err) => {
    logger.error('unable to connect to the database: ', err);
    throw err;
  });

  let models = fs.readdirSync(path.join('src', 'server', 'models')).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js');
  });

  // loading model
  for (let i in models) {
    let file = models[i];
    let modelName = file.split('.')[0];
    //let obj = await import(path.resolve('src', 'server', 'models', file));
    let obj = await import('./' + file);
    let model = await obj.default(sequelize, Sequelize);
    db[modelName] = model;
    console.log(db[modelName])
  }

  // define relationship
  db.user.hasOne(db.university, {});
  db.session.belongsTo(db.user, { foreignKey: 'deanId', as: 'dean' });
  db.session.belongsTo(db.user, { foreignKey: 'userId', as: 'student' });

  // add relationship
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return db;
};