const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const FeaturesController = require(path.resolve('controllers/classifiers/features'));

// Get features (infrastructure) list
router.get('/', function(req, res, next) {
  FeaturesController.findAll(req.query).then(features => {
    res.jsend.success({features});
  }, next);
});
