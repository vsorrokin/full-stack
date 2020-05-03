if (!global.GCONFIG) {
  global.GCONFIG = require('../../config.json');
}

// Dependencies
const path               = require('path');
const express            = require('express');
const favicon            = require('serve-favicon');
const compression        = require('compression');
const microcache         = require('route-cache');
const Render             = require('./render.js');
const resolve            = file => path.resolve(__dirname, file);
const expressStaticGzip  = require("express-static-gzip");
const listen             = require('../listen');

// Settings
const settings = {
  isProd: process.env.NODE_ENV === 'production',
  useMicroCache: process.env.MICRO_CACHE !== 'false',
  templatePath: resolve('../../src/index.html')
};

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && settings.isProd ? 1000 * 60 * 60 * 24 * 30 : 0
});

// Init the server
(async function() {
  // Create express app
  const app = express();
  settings.app = app;

  // Init Vue SSR renderer
  const render = new Render(settings);
  await render.init();

  app.use(GCONFIG.client.publicPath, expressStaticGzip(resolve('../../dist')));

  // Run render on any route request
  app.get('*', (req, res) => render.start(req, res));

  // Start the server
  listen(app, settings.isProd);
})();


// const serve = (path, cache) => express.static(resolve(path), {
//   maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0
// })
//app.use(compression({ threshold: 0 }))
//app.use(favicon('src/assets/images/favicon.png'))
//app.use('/dist', serve(resolve('dist'), true))
// app.use('/public', serve('../public', true))
// app.use('/manifest.json', serve('../manifest.json', true))
// app.use('/service-worker.js', serve('../dist/service-worker.js'))

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
//app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))
