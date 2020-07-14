if (!global.GCONFIG) {
  global.GCONFIG = require('../../config.json');
}

if (!global.GSECRET) {
  global.GSECRET = require('../../secret/credentials.json');
}

const path = require("path");
const rimraf = require("rimraf");

const dbService = require('../../lib/db_service');
const redisService = require('../../lib/redis_service');

(async () => {
  await redisService.initRedisConnection();
  await dbService.initDbConnection();

  const db = require("../../models");

  console.log('Destroy DB Posts');
  await db.Post.destroy({
    where: {},
    truncate: { cascade: true }
  });

  console.log('Destroy DB Files');
  await db.File.destroy({
    where: {},
    truncate: { cascade: true }
  });

  console.log('Destroy FS files');
  rimraf.sync(path.resolve(GCONFIG.API.fileStoragePath));

  console.log('Clear success!');

  process.exit();
})();
