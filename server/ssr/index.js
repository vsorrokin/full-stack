const port = process.env.PORT || 8443;

// Dependencies
const path               = require('path');
const express            = require('express');
const favicon            = require('serve-favicon');
const compression        = require('compression');
const microcache         = require('route-cache');
const opn                = require('opn');
const https              = require('https');
const fs                 = require('fs');
const Render             = require('./render.js');
const resolve            = file => path.resolve(__dirname, file);

const buildConfig = require('../../config/build');

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

  app.use(buildConfig.publicPath, serve(resolve('../../dist'), true));

  // Run render on any route request
  app.get('*', (req, res) => render.start(req, res));

  // Start the server
  const httpsServer = https.createServer({
    key: fs.readFileSync(resolve('../../ssl/localhost-key.pem')),
    cert: fs.readFileSync(resolve('../../ssl/localhost.pem'))
  }, app);

  httpsServer.listen(port, function () {
    opn(`https://localhost:${port}`);

    console.log(`Production HTTPS app listening on port ${port}!`);
  });
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
