const Promise  = require('bluebird');
const pgNative = require('pg-native');

const serviceConfig = require('../config/service');
const credentials = require('../config/credentials');

const settings = {
  maxConnectionRetryCount: 20,
  connectionTryPauseBeforeNext: 5000
};

const pgClient = new pgNative();


class dbService {
  connect() {
    return new Promise((resolve, reject) => {
      this.tryToConnect(resolve, reject);
    });
  }

  tryToConnect(resolve, reject, retriesCount) {
    if (retriesCount === undefined) retriesCount = 1;

    if (retriesCount > 1) {
      console.log('Trying to connect to the database. Try number:', retriesCount);
    }

    if (retriesCount >= settings.maxConnectionRetryCount) {
      console.log("Can't connect to the Database. Please check your connection settings in config/credentials.js");
      reject();
      return;
    }

    try {
      pgClient.connectSync(`
        dbname=postgres
        host=${serviceConfig.postgres.host}
        user=${credentials.postgres.user}
        password=${credentials.postgres.password}
        port=${serviceConfig.postgres.port}
      `);
      resolve();
    } catch(e) {
      console.log(e);
      setTimeout(() => {
        this.tryToConnect(resolve, reject, ++retriesCount);
      }, settings.connectionTryPauseBeforeNext);

    }

  }

  createDatabase() {
    pgClient.querySync(`
      CREATE EXTENSION IF NOT EXISTS dblink;
      DO
      $do$
      BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '${serviceConfig.postgres.name}') THEN
            PERFORM dblink_exec('dbname=' || current_database()  -- current db
                              , 'CREATE DATABASE ${serviceConfig.postgres.name}');
         END IF;
      END
      $do$;
    `);

    //this.createExtensions();
  }

  createExtensions() {
    pgClient.connectSync(`
      dbname=${serviceConfig.postgres.name}
      host=${serviceConfig.postgres.host}
      user=${credentials.postgres.user}
      password=${credentials.postgres.password}
      port=${serviceConfig.postgres.port}
    `);

    pgClient.querySync('CREATE EXTENSION IF NOT EXISTS postgis;');
  }

  initDbConnection(options) {
    this.options = options || Object.create(null);
    this.databaseName = serviceConfig.postgres.name;

    if (this.options.dbPostfix) {
      this.databaseName += this.options.dbPostfix;
    }

    return this.connect().then(() => {
      console.log('Database connection successfully established');
      this.createDatabase();
      pgClient.end();
    });
  }
}

module.exports = new dbService();
