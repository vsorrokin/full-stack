const express = require('express');
const path    = require('path');

const environment = process.env.NODE_ENV || 'development';

const router = module.exports = express.Router();

const lotsController = require(path.resolve('controllers/lots'));

// Get lots count by filters
router.get('/', function(req, res, next) {

  if (environment === 'development') {
    console.log(req.query);
  }

  lotsController.count(req.query).then(count => {
    res.jsend.success({count, query: req.query});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
});

// Get lots count in every lot type grouped by segments
router.get('/advanced', function(req, res, next) {
  lotsController.countsAdvanced().then(counts => {
    res.jsend.success({counts});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
});

// Get lots count grouped by country
router.get('/country', function(req, res, next) {
  lotsController.countsCountry(req.query).then(counts => {
    res.jsend.success({counts});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
});

// Get lots offers count and its types by parent_url_id
router.get('/parent', function(req, res, next) {
  lotsController.countsParent(req.query).then(counts => {
    res.jsend.success({counts});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
});
