const path = require('path');

const { Post } = require(path.resolve('models'));

class PostsController {
  create(post) {
    return Post.bulkCreate([post]);
  }
}

module.exports = new PostsController();
