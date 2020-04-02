const opn = require('opn');

const run = require('../common/cmd_runner');

const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String, defaultOption: 'dev' }
]);

const serviceConfig = require('./config/service');
const credentials = require('./config/credentials');

const dockerComposeEnv = `cross-env
     PGADMIN_PORT=${serviceConfig.pgadmin.port}
     PGADMIN_USER=${credentials.pgadmin.user}
     PGADMIN_PASSWORD=${credentials.pgadmin.password}

     POSTGRES_DB_NAME=${serviceConfig.postgres.name}
     POSTGRES_PORT=${serviceConfig.postgres.port}
     POSTGRES_USER=${credentials.postgres.user}
     POSTGRES_PASSWORD=${credentials.postgres.password}`;


switch (options.task) {
  case 'db-rebuild':
    run(`${dockerComposeEnv} docker-compose up --force-recreate`);
    break;

  case 'dev':

    run(`${dockerComposeEnv} docker-compose up`);

    //run('nodemon server.js');

    break;

  case 'pgadmin':
    opn(`http://127.0.0.1:${serviceConfig.pgadmin.port}`);
    break;
}
