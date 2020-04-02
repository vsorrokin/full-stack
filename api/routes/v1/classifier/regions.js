const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const regionsController = require(path.resolve('controllers/classifiers/regions'));

// Get regions list (Arbat, Tsaritsino, Lubyanka etc.)
router.get('/', function(req, res, next) {
  regionsController.findAll(req.query).then(regions => {
    res.jsend.success({regions});
  }, next);
});
