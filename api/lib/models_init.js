// Dependencies
const path             = require('path');
const Cacher           = require('sequelize-redis-cache');
const redis            = require('redis');
const sqlFormatter     = require('sql-formatter');
const SQL              = require('sql-tagged-template-literal');

const serviceConfig = require('../config/service');
const credentials   = require('../config/credentials');

const SequelizeInit = require(path.resolve('lib/sequelize_init'));

const env = process.env.NODE_ENV || 'development';

class ModelsInit {

  get(settings) {
    this.settings = settings;
    const ORM = new SequelizeInit(this.settings);

    // Connect knex query builder
    const knex = require('knex')({
      client: 'pg',
      connection: {
        host: serviceConfig.postgres.host,
        port: serviceConfig.postgres.port,
        user : credentials.postgres.user,
        password : credentials.postgres.password,
        database : serviceConfig.postgres.name
      }
    });

    // Connect to redis and initialize sequelize cacher
    const redisConnection = redis.createClient(serviceConfig.redis.port, serviceConfig.redis.host);
    const cacherPrefix = `seq_cacher_${env}`;
    const cacher = () => Cacher(ORM.sequelize, redisConnection).prefix(cacherPrefix);

    const db = ORM.db;

    //ORM.sequelize.sync({force: true});

    // Export DB module
    db.sequelize    = ORM.sequelize;
    db.Sequelize    = ORM.Sequelize;
    db.knex         = knex;
    db.cacher       = cacher;
    db.redis        = redisConnection;
    db.cacherPrefix = cacherPrefix;
    db.SQL          = SQL;
    db.sqlFormatter = sqlFormatter;

    return db;
  }
}

module.exports = ModelsInit;
