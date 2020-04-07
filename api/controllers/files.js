const path = require('path');

const { File, cacher } = require(path.resolve('models'));

class FilesController {
  create(file) {
    return File.bulkCreate([file]);
  }
}

module.exports = new FilesController();
