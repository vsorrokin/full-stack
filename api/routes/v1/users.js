const express = require('express');
const usersController = require('../../controllers/users');

const router = module.exports = express.Router();

router.get('/', function(req, res, next) {
  usersController.findAll().then(users => {
    res.jsend.success({users});
  }, next);
});
