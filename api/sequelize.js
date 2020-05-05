if (!global.GCONFIG) {
  global.GCONFIG = require('./config.json');
}

if (!global.GSECRET) {
  global.GSECRET = require('./secret/credentials.json');
}

module.exports = {
  development: {
    username: GSECRET.postgres.user,
    password: GSECRET.postgres.password,
    database: GCONFIG.API.postgres.name,
    host: GCONFIG.API.postgres.host,
    port: GCONFIG.API.postgres.port,
    dialect: 'postgres',
    seederStorage: "sequelize"
  }
};
