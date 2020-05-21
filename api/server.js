if (!global.GCONFIG) {
  global.GCONFIG = require('./config.json');
}

if (!global.GSECRET) {
  global.GSECRET = require('./secret/credentials.json');
}

const gqlImport = require('graphql-import');
const { ApolloServer } = require("apollo-server-express");

// Save environment to the variable
const env = process.env.NODE_ENV || 'development';

// Dependencies
const express     = require('express');
const compression = require('compression');
const path        = require('path');
const passport    = require('passport');

const dbService = require('./lib/db_service');
const redisService = require('./lib/redis_service');

(async () => {
  await redisService.initRedisConnection();
  await dbService.initDbConnection();

  // GraphQL
  const typeDefs = gqlImport.importSchema('./graphql/schema.graphql');
  const resolvers = require("./graphql/resolvers");
  const schemaDirectives = require("./graphql/directives");
  const db = require("./models");
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    schemaDirectives,
    context: (context) => {
      return { db, req: context.req, res: context.res };
    },
    debug: true
  });

  require('./lib/passport');

  // Enable unlimited depth of object output in console.log
  if (env === 'development') {
    require("util").inspect.defaultOptions.depth = null;
  }

  // Init express
  const app = express();

  apolloServer.applyMiddleware({ app });

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

  app.listen(GCONFIG.API.port, function () {
    console.log(`API ${env} server listening on port ${GCONFIG.API.port}!`);
  });
})();
