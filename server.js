const port = 8443;

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const express = require('express');
const opn = require('opn');
const history = require('connect-history-api-fallback');
const expressStaticGzip = require("express-static-gzip");

const app = express();

app.use(history());
app.use('/', expressStaticGzip('dist'));

const httpsServer = https.createServer({
  key: fs.readFileSync(path.resolve('./ssl/localhost-key.pem')),
  cert: fs.readFileSync(path.resolve('./ssl/localhost.pem'))
}, app);

httpsServer.listen(port, function () {
  opn(`https://localhost:${port}`);
  console.log(`Production HTTPS app listening on port ${port}!`);
});
