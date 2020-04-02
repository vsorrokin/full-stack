const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const lotsController = require(path.resolve('controllers/lots'));

// Get lots list based on input query filter
router.get('/', function(req, res, next) {
  lotsController.findAll(req.query).then(lots => {
    res.jsend.success({count: lots.count, lots: lots.rows, query: req.query});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
});

// Get lot by its url_id
router.get('/:url_id', function(req, res, next) {
  lotsController.find(req.params).then(lot => {
    res.jsend.success({lot});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
});
