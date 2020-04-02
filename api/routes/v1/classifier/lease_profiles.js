const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const LeaseProfilesController = require(path.resolve('controllers/classifiers/lease_profiles'));

// Get lease profiles list (Банк, Магазин, Продуктовый ритейл etc.)
router.get('/', function(req, res, next) {
  LeaseProfilesController.findAll(req.query).then(lease_profiles => {
    res.jsend.success({lease_profiles});
  }, next);
});
