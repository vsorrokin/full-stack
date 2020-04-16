const opn = require('opn');

const run = require('../common/cmd_runner');

const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String, defaultValue: 'dev' }
]);

const serviceConfig = require('./config/service');
const credentials = require('./config/credentials');

const dockerComposeEnv = `cross-env
     PGADMIN_PORT=${serviceConfig.pgadmin.port}
     PGADMIN_USER=${credentials.pgadmin.user}
     PGADMIN_PASSWORD=${credentials.pgadmin.password}

     POSTGRES_PORT=${serviceConfig.postgres.port}
     POSTGRES_USER=${credentials.postgres.user}
     POSTGRES_PASSWORD=${credentials.postgres.password}

     REDIS_PORT=${serviceConfig.redis.port}`;

const sequelizeConfig = `--url 'postgres://${credentials.postgres.user}:${credentials.postgres.password}@${serviceConfig.postgres.host}:${serviceConfig.postgres.port}/${serviceConfig.postgres.name}'`;

switch (options.task) {
  case 'seed':
    run(`sequelize db:seed:all ${sequelizeConfig}`)
    break;

  case 'migrate:undo':
    run(`sequelize db:migrate:undo ${sequelizeConfig}`)
    break;

  case 'migrate':
    run(`sequelize db:migrate ${sequelizeConfig}`)
    break;

  case 'db:rebuild':
    run(`${dockerComposeEnv} docker-compose build`);
    break;

  case 'dev':

    run(`${dockerComposeEnv} docker-compose up`);

    run('nodemon server.js');

    break;

  case 'pgadmin':
    opn(`http://127.0.0.1:${serviceConfig.pgadmin.port}`);
    break;
}
