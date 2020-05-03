const Promise  = require('bluebird');
const Redis    = require('ioredis');

class RedisService {

  constructor() {
    this.settings = {
      maxConnectionRetryCount: 20,
      connectionTryPauseBeforeNext: 5000
    };

    process.on('uncaughtException', this.uncaughtException);
  }

  uncaughtException(e) {

  }

  async connect(retriesCount = 1) {
    if (retriesCount > 1) {
      console.log('Trying to connect to Redis. Try number:', retriesCount);
    }

    if (retriesCount >= this.settings.maxConnectionRetryCount) {
      throw "Can't connect to Redis. Please check your connection settings in secret/credentials.json";
    }

    try {

      await new Promise(function(resolve, reject) {
        new Redis({
          port: GCONFIG.API.redis.port,
          host: GCONFIG.API.redis.host,
          retryStrategy: () => undefined
        })
        .on('error', reject)
        .on('connect', resolve);
      });

      return true;

    } catch(e) {
      //console.log('REDIS CONNECTION ERROR', e);

      await new Promise((resolve) => setTimeout(resolve, this.settings.connectionTryPauseBeforeNext));

      await this.connect(++retriesCount);
    }
  }


  initRedisConnection() {
    return this.connect().then(() => {
      process.removeListener('uncaughtException', this.uncaughtException)
      console.log('Redis connection successfully established');
    });
  }
}

module.exports = new RedisService();
