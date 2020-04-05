const path = require('path');

const { Users, cacher } = require(path.resolve('models'));

class UsersController {
  cacheTTL(key) {
    return 1000;
  }

  findAll(inputQuery = {}) {
    const cachedQueryExecutor = cacher().model('Users').ttl(this.cacheTTL('findAll'));

    const queryParams = {
      attributes: ['id', 'first_name', 'last_name'],
      where: {}
    };

    return cachedQueryExecutor.findAll(queryParams);
  }
}

module.exports = new UsersController();
