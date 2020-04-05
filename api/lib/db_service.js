const Promise  = require('bluebird');
const pgNative = require('pg-native');

const serviceConfig = require('../config/service');
const credentials = require('../config/credentials');

class DBService {
  constructor() {
    this.pgClient = new pgNative();

    this.settings = {
      maxConnectionRetryCount: 20,
      connectionTryPauseBeforeNext: 5000
    };
  }

  async connect(retriesCount = 1) {
    if (retriesCount > 1) {
      console.log('Trying to connect to the database. Try number:', retriesCount);
    }

    if (retriesCount >= this.settings.maxConnectionRetryCount) {
      throw "Can't connect to the Database. Please check your connection settings in config/credentials.js";
    }

    try {
      this.pgClient.connectSync(`
        dbname=postgres
        host=${serviceConfig.postgres.host}
        user=${credentials.postgres.user}
        password=${credentials.postgres.password}
        port=${serviceConfig.postgres.port}
      `);
      return true;
    } catch(e) {
      console.log('DB CONNECTION ERROR', e);

      await new Promise((resolve) => setTimeout(resolve, this.settings.connectionTryPauseBeforeNext));

      await this.connect(++retriesCount);
    }
  }

  createDatabase() {
    this.pgClient.querySync(`CREATE DATABASE ${this.databaseName}`);
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
      this.pgClient.end();
    });
  }
}

module.exports = new DBService();
