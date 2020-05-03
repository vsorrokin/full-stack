if (!global.GCONFIG) {
  global.GCONFIG = require('../../config.json');
}

const path              = require('path');
const express           = require('express');
const history           = require('connect-history-api-fallback');
const expressStaticGzip = require("express-static-gzip");
const resolve           = file => path.resolve(__dirname, file);
const listen            = require('../listen');

const app = express();

app.use(history());
app.use('/', expressStaticGzip(resolve('../../dist')));
listen(app);
