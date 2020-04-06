const serviceConfig = require('../api/config/service');

module.exports = {
  mode: 'SSR', //SSR/SPA
  HTTPS: true,
  publicPath: '/dist',
  API: {
    root: `http://127.0.0.1:${serviceConfig.server.port}`
  }
}
