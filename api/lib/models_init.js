// Dependencies
const path             = require('path');
const Cacher           = require('sequelize-redis-cache');
const redis            = require('redis');
const sqlFormatter     = require('sql-formatter');
const SQL              = require('sql-tagged-template-literal');

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
        host: GCONFIG.API.postgres.host,
        port: GCONFIG.API.postgres.port,
        user : GSECRET.postgres.user,
        password : GSECRET.postgres.password,
        database : GCONFIG.API.postgres.name
      }
    });

    // Connect to redis and initialize sequelize cacher
    const redisConnection = redis.createClient(GCONFIG.API.redis.port, GCONFIG.API.redis.host);
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
