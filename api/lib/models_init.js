// Dependencies
const path             = require('path');
const Cacher           = require('sequelize-redis-cache');
const redis            = require('redis');
const config           = require(path.resolve('lib/config'));
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
        host : this.settings.host,
        user : this.settings.username,
        password : this.settings.password,
        database : this.settings.database
      }
    });

    // Connect to redis and initialize sequelize cacher
    const redisConnection = redis.createClient(config.get('redis:port'), config.get('redis:host'));
    const cacherPrefix = `seq_cacher_${env}`;
    const cacher = () => Cacher(ORM.sequelize, redisConnection).prefix(cacherPrefix);

    const db = ORM.db;

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
