global.GCONFIG = require('./config.json');

const {spawn} = require ('child_process');

const commandLineArgs = require('command-line-args');

function run(cmd) {
  console.log('EXECUTING:', cmd);
  const spawned = spawn(cmd, [], {shell: true, stdio: 'inherit'});
}

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String, defaultValue: 'dev' }
]);

switch (options.task) {
  case 'dev':

    switch (GCONFIG.client.mode) {
      case 'SSR':
        run('NODE_ENV=development node server/ssr/index.js');
        break;
      case 'SPA':
        run('NODE_ENV=development webpack-dev-server --config ./build/spa/dev.conf.js');
        break;
    }

    break;

  case 'prod':

    switch (GCONFIG.client.mode) {
      case 'SSR':
        run('NODE_ENV=production node server/ssr');
        break;
      case 'SPA':
        run('NODE_ENV=production node server/spa');
        break;
    }

    break;

  case 'build':

    switch (GCONFIG.client.mode) {
      case 'SSR':
        run(`
          rimraf dist &&
          NODE_ENV=production webpack --config ./build/ssr/client.conf.js &&
          NODE_ENV=production webpack --config ./build/ssr/server.conf.js
        `);
        break;
      case 'SPA':
        run('rimraf dist && webpack --config ./build/spa/prod.conf.js');
        break;
    }

    break;
}
