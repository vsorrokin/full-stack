const path = require('path');

const { Post, cacher } = require(path.resolve('models'));

class PostsController {
  cacheTTL(key) {
    return 1000;
  }

  create(post) {
    return Post.bulkCreate([post]);
  }

  findAll(inputQuery = {}) {
    const cachedQueryExecutor = cacher().model('Post').ttl(this.cacheTTL('findAll'));

    const queryParams = {
      attributes: ['id', 'video_id', 'cover_id', 'song_link', 'description', 'createdAt'],
      where: {}
    };

    return cachedQueryExecutor.findAll(queryParams, {
      raw: true
    });
  }
}

module.exports = new PostsController();
