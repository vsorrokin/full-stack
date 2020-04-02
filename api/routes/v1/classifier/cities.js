const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const CitiesController = require(path.resolve('controllers/classifiers/cities'));

// Get countries list
router.get('/', function(req, res, next) {
  CitiesController.findAll(req.query).then(cities => {
    res.jsend.success({cities});
  }, next);
});
