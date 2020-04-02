const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const highwaysController = require(path.resolve('controllers/classifiers/highways'));

// Get highways list (Ryazanskoe, Novorizhskoe etc.)
router.get('/', function(req, res, next) {
  highwaysController.findAll(req.query).then(highways => {
    res.jsend.success({highways});
  }, next);
});
