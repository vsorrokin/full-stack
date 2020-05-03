const Promise  = require('bluebird');
const pgNative = require('pg-native');

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
      throw "Can't connect to the Database. Please check your connection settings in secret/credentials.json";
    }

    try {
      this.pgClient.connectSync(`
        dbname=postgres
        host=${GCONFIG.API.postgres.host}
        user=${GSECRET.postgres.user}
        password=${GSECRET.postgres.password}
        port=${GCONFIG.API.postgres.port}
      `);
      return true;
    } catch(e) {
      //console.log('DB CONNECTION ERROR', e);

      await new Promise((resolve) => setTimeout(resolve, this.settings.connectionTryPauseBeforeNext));

      await this.connect(++retriesCount);
    }
  }

  createDatabase() {
    this.pgClient.querySync(`
      CREATE EXTENSION IF NOT EXISTS dblink;
      DO
      $do$
      BEGIN
         IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '${this.databaseName}') THEN
            PERFORM dblink_exec('dbname=' || current_database()  -- current db
                              , 'CREATE DATABASE ${this.databaseName}');
         END IF;
      END
      $do$;
    `);

    // try {
    //   this.pgClient.querySync(`CREATE DATABASE ${this.databaseName}`);
    // } catch (e) {
    //
    // }
  }

  initDbConnection(options) {
    this.options = options || Object.create(null);
    this.databaseName = GCONFIG.API.postgres.name;

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
