const Promise  = require('bluebird');
const Redis    = require('ioredis');

const serviceConfig = require('../config/service');
const credentials = require('../config/credentials');

const settings = {
  maxConnectionRetryCount: 20,
  connectionTryPauseBeforeNext: 5000
};

class RedisService {

  constructor() {
    this.retriesCount = 1;
  }

  onFail(resolve, reject) {
    return () => {
      clearTimeout(this.retryTimeout);
      this.retryTimeout = setTimeout(() => {

        if (this.retriesCount > 1) {
          console.log('Trying to connect to the redis. Try number:', this.retriesCount);
        }

        if (this.retriesCount >= settings.maxConnectionRetryCount) {
          console.log("Can't connect to the redis. Please check your connection settings in config/local.json");
          reject();
          return;
        }

        this.retriesCount++;

        self.tryToConnect(resolve, reject);
      }, settings.connectionTryPauseBeforeNext);
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.tryToConnect(resolve, reject);

      //process.on('uncaughtException', this.onFail(resolve, reject));
    });
  }

  tryToConnect(resolve, reject) {
    new Redis({
      port: serviceConfig.redis.port,
      host: serviceConfig.redis.host,
      retryStrategy: () => undefined
    })
    .on('error', err => {})
    .on('connect', () => {
      //process.removeEventListener('uncaughtException', this.onFail(resolve, reject));
      resolve();
    });

    //Redis.Promise.onPossiblyUnhandledRejection(() => {});
  }

  initRedisConnection() {
    return this.connect().then(() => {
      console.log('Redis connection successfully established');
    });
  }
}

module.exports = new RedisService();
