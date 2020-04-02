const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const UndergroundStationsController = require(path.resolve('controllers/classifiers/underground_stations'));

// Get undergrounds list
router.get('/', function(req, res, next) {
  UndergroundStationsController.findAll(req.query).then(underground_stations => {
    res.jsend.success({underground_stations});
  }, next);
});
