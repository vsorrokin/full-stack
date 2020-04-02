const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const CountriesController = require(path.resolve('controllers/classifiers/countries'));

// Get countries list
router.get('/', function(req, res, next) {
  CountriesController.findAll(req.query).then(countries => {
    res.jsend.success({countries});
  }, next);
});
