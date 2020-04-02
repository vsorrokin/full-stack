const Sequelize = require('sequelize');
const recursiveReadDir = require('recursive-readdir-sync');

class SequelizeInit {
  constructor(config) {
    this.config = config;
    this._connect();
    this._collectModels();

    return {
      sequelize: this.sequelize,
      db: this.db,
      Sequelize
    };
  }

  _connect() {
    this.sequelize = new Sequelize(this.config.database, this.config.username, this.config.password, {
      host: this.config.host,
      dialect: this.config.dialect,
      logging: sql => {
        if (typeof this.config.log === 'function') {
          this.config.log(sql);
        }
      },
      pool: {
        idle: 60000,
        acquire: 60000
      }
    });
  }

  _collectModels() {
    this.db = {};

    const files = recursiveReadDir(this.config.dirPath);

    files.filter(function(file) {
      return (file.indexOf('.js') !== -1 && file.indexOf('index.js') === -1);
    })
    .forEach(file => {
      var model = this.sequelize.import(file);
      this.db[model.name] = model;
    });

    Object.keys(this.db).forEach(modelName => {
      if ("associate" in this.db[modelName]) {
        this.db[modelName].associate(this.db);
      }
    });
  }
}

module.exports = SequelizeInit;
