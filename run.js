const run = require('./common/cmd_runner');

const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String, defaultValue: 'dev' }
]);

const buildConfig = require('./config/main');

switch (options.task) {
  case 'dev':

    run('yarn api');

    switch (buildConfig.mode) {
      case 'SSR':
        run('cross-env NODE_ENV=development node server/ssr/index.js');
        break;
      case 'SPA':
        run('cross-env NODE_ENV=development webpack-dashboard -- webpack-dev-server --config ./build/spa/dev.conf.js');
        break;
    }

    break;

  case 'prod':

    switch (buildConfig.mode) {
      case 'SSR':
        run('cross-env NODE_ENV=production node server/ssr');
        break;
      case 'SPA':
        run('cross-env NODE_ENV=production node server/spa');
        break;
    }

    break;

  case 'build':

    switch (buildConfig.mode) {
      case 'SSR':
        run(`
          rimraf dist &&
          cross-env NODE_ENV=production webpack --config ./build/ssr/client.conf.js &&
          cross-env NODE_ENV=production webpack --config ./build/ssr/server.conf.js
        `);
        break;
      case 'SPA':
        run('rimraf dist && webpack --config ./build/spa/prod.conf.js');
        break;
    }

    break;
}
