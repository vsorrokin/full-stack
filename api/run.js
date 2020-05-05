const run = require('./cmd_runner');

const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String }
]);

switch (options.task) {
  case 'seed':
    run(`sequelize db:seed:all`)
    break;

  case 'seed:undo':
    run(`sequelize db:seed:undo:all`)
    break;

  case 'migrate:undo':
    run(`sequelize db:migrate:undo`)
    break;

  case 'migrate':
    run(`sequelize db:migrate`)
    break;
}
