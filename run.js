const commandLineArgs = require('command-line-args');

const options = commandLineArgs([
  { name: 'task', alias: 't', type: String, defaultOption: 'dev' }
]);

const execa = require('execa');

async function run(cmd) {
  const cmdsString = cmd.trim().replace(/\s\s+/g, ' ')
  const cmdsList = cmdsString.split('&&');

  for (let i = 0; i < cmdsList.length; i++) {
    const cmdParts = cmdsList[i].trim().split(' ');

    await execa(cmdParts[0], cmdParts.slice(1), {preferLocaL: true, stdio: 'inherit'});
  }
}

const buildConfig = require('./config/build');

switch (options.task) {
  case 'dev':

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
