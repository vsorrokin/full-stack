const path = require('path');

const { File, cacher } = require(path.resolve('models'));

class FilesController {
  create(file) {
    return File.bulkCreate([file]);
  }

  async findOneById(id) {
    const cachedQueryExecutor = cacher().model('File').ttl(1000);

    const queryParams = {
      attributes: ['id', 'local_name', 'size', 'type'],
      where: {
        id
      }
    };

    const result = await cachedQueryExecutor.findAll(queryParams, {
      raw: true
    });

    return result[0];
  }
}

module.exports = new FilesController();
