const path = require('path');

const { User, cacher } = require(path.resolve('models'));

class UsersController {
  cacheTTL(key) {
    return 1000;
  }

  async findOneById(id) {
    const cachedQueryExecutor = cacher().model('User').ttl(1000);

    const queryParams = {
      attributes: ['id', 'first_name', 'last_name', 'email'],
      where: {
        id
      }
    };

    const result = await cachedQueryExecutor.findAll(queryParams);

    return result[0];
  }

  async findOneByEmail(email) {
    const cachedQueryExecutor = cacher().model('User').ttl(1000);

    const queryParams = {
      attributes: ['id', 'first_name', 'last_name', 'email', 'password'],
      where: {
        email
      }
    };

    const result = await cachedQueryExecutor.findAll(queryParams);

    return result[0];
  }

  findAll(inputQuery = {}) {
    const cachedQueryExecutor = cacher().model('User').ttl(this.cacheTTL('findAll'));

    const queryParams = {
      attributes: ['id', 'first_name', 'last_name', 'email'],
      where: {}
    };

    return cachedQueryExecutor.findAll(queryParams);
  }
}

module.exports = new UsersController();
