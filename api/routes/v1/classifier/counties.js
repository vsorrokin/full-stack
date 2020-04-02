const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const CountiesController = require(path.resolve('controllers/classifiers/counties'));

// Get counties list (ЦАО, ЮАО etc.)
router.get('/', function(req, res, next) {
  CountiesController.findAll(req.query).then(counties => {
    res.jsend.success({counties});
  }, next);
});
