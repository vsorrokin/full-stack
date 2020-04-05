// Dependencies
const path   = require('path');
const sqlFormatter = require('sql-formatter');

const serviceConfig = require('../config/service');
const credentials   = require('../config/credentials');

const ModelsInit = require(path.resolve('lib/models_init'));

module.exports = new ModelsInit().get({
  database: serviceConfig.postgres.name,
  username: credentials.postgres.user,
  password: credentials.postgres.password,
  host: serviceConfig.postgres.host,
  port: serviceConfig.postgres.port,
  dialect: 'postgres',
  dirPath: path.resolve('models'),
  log: sql => {
    //console.log(sqlFormatter.format(sql));
  }
});
