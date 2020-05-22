const run = require('./cmd_runner');

const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String },
  { name: 'name', alias: 'n', type: String }
]);

switch (options.task) {
  case 'seed':
    run(`sequelize db:seed:all`)
    break;

  case 'seed:undo':
    run(`sequelize db:seed:undo:all`)
    break;

  case 'seed:create':
    run(`sequelize seed:create --name ${options.name}`)
    break;

  case 'migrate:undo':
    run(`sequelize db:migrate:undo`)
    break;

  case 'migration:create':
    run(`sequelize migration:create --name ${options.name}`)
    break;

  case 'migrate':
    run(`sequelize db:migrate`)
    break;
}
