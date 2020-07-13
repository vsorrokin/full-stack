const port = GCONFIG.client.port;

const fs      = require('fs');
const path    = require('path');
const opn     = require('opn');
const https   = require('https');
const resolve = file => path.resolve(__dirname, file);

module.exports = function(app, isProd = true) {
  if (!GCONFIG.client.HTTPS) {

    app.listen(port, () => {
      opn(`http://localhost:${port}`);
      console.log(`${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} ${GCONFIG.client.mode} HTTP app listening on port ${port}!`);
    });

    return;

  }

  const httpsServer = https.createServer({
    key: fs.readFileSync(resolve('../ssl/localhost-key.pem')),
    cert: fs.readFileSync(resolve('../ssl/localhost.pem'))
  }, app);

  httpsServer.listen(port, function () {
    opn(`https://localhost:${port}`);
    console.log(`${isProd ? 'PRODUCTION' : 'DEVELOPMENT'} ${GCONFIG.client.mode} HTTPS app listening on port ${port}!`);
  });

}
