module.exports = ({GCONFIG, shell, areYouSure}) => {
  return {

    // Run development server
    dev_server() {
      switch (GCONFIG.client.mode) {
        case 'SSR':
          shell('NODE_ENV=development node ./development/server/ssr/index.js');
          break;
        case 'SPA':
          shell('NODE_ENV=development webpack-dev-server --config ./build/spa/dev.conf.js');
          break;
      }
    },

    // Run development environment
    dev() {
      shell('mut dev');
    },

    // Run production server
    prod_server() {
      switch (GCONFIG.client.mode) {
        case 'SSR':
          shell('NODE_ENV=production node ./development/server/ssr');
          break;
        case 'SPA':
          shell('NODE_ENV=production node ./development/server/spa');
          break;
      }
    },

    prod() {
      shell('mut prod');
    },

    // Build command itself (to run in docker or at host)
    build_task() {
      switch (GCONFIG.client.mode) {
        case 'SSR':
          shell(`
            rimraf dist &&
            NODE_ENV=production webpack --config ./development/build/ssr/client.conf.js &&
            NODE_ENV=production webpack --config ./development/build/ssr/server.conf.js
          `);
          break;
        case 'SPA':
          shell('rimraf dist && webpack --config ./development/build/spa/prod.conf.js');
          break;
      }
    },

    build() {
      shell('cmd yarn cli build_task || mut build');
    }

  }
}
