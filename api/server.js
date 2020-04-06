// Dependencies
const express     = require('express');
const compression = require('compression');
const path        = require('path');
const passport    = require('passport');

require('./passport');

const serviceConfig = require('./config/service');

// Library for trying to connect to the db and to create initial database if not exists
const dbService = require('./lib/db_service');

// Library for trying to connect to the redis
const redisService = require('./lib/redis_service');

// Save environment to the variable
const env = process.env.NODE_ENV || 'development';

// Enable unlimited depth of object output in console.log
if (env === 'development') {
  require("util").inspect.defaultOptions.depth = null;
}

// Init express
const app = express();

// Enable gzip compression for response body
// @TODO: better to do that using nginx proxy
app.use(compression());

// Enable cors for dev env
if (env === 'development') {
  app.use(require('cors')());
}

// Include routes
app.use('/', require('./routes'));

// Send 404 status if route not found
app.use((req, res) => res.status(404).end());

(async () => {
  app.listen(serviceConfig.server.port, function () {
    console.log(`API ${env} server listening on port ${serviceConfig.server.port}!`);
  });

  await dbService.initDbConnection();
  await redisService.initRedisConnection();
})();
