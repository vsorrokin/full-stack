const run = require('./cmd_runner');

const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String }
]);

const sequelizeConfig = `--url 'postgres://${GSECRET.postgres.user}:${GSECRET.postgres.password}@${GCONFIG.API.postgres.host}:${GCONFIG.API.postgres.port}/${GCONFIG.API.postgres.name}'`;

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
}
