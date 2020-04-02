const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const highwayRingsController = require(path.resolve('controllers/classifiers/highway_rings'));

// Get highway rings (MKAD, TTK etc.)
router.get('/', function(req, res, next) {
  highwayRingsController.findAll(req.query).then(highway_rings => {
    res.jsend.success({highway_rings});
  }, next);
});
