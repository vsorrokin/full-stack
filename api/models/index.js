// Dependencies
const path   = require('path');
const sqlFormatter = require('sql-formatter');

const ModelsInit = require(path.resolve('lib/models_init'));

module.exports = new ModelsInit().get({
  database: GCONFIG.API.postgres.name,
  username: GSECRET.postgres.user,
  password: GSECRET.postgres.password,
  host: GCONFIG.API.postgres.host,
  port: GCONFIG.API.postgres.port,
  dialect: 'postgres',
  dirPath: path.resolve('models'),
  log: sql => {
    //console.log(sqlFormatter.format(sql));
  }
});
