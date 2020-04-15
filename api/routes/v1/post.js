const express = require('express');
const passport = require('passport');
const postsController = require('../../controllers/posts');

const router = module.exports = express.Router();


router.post('/', passport.authenticate('jwt', {session: false}), (req, res, next) => {

  postsController.create(req.body).then(posts => {
    res.jsend.success({
      post: posts[0]
    });
  }, next);

});

router.get('/', (req, res, next) => {

  postsController.findAll().then(posts => {
    res.jsend.success({
      posts
    });
  }, next);

});
