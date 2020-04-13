const express = require('express');
const postsController = require('../../controllers/posts');

const router = module.exports = express.Router();


router.post('/', (req, res, next) => {

  postsController.create(req.body).then(posts => {
    res.jsend.success({
      post: posts[0]
    });
  }, next);

});
