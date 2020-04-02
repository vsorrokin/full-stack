const express = require('express');
const path    = require('path');

const router = module.exports = express.Router();

const CompassDirectionsController = require(path.resolve('controllers/classifiers/compass_directions'));

// Get compass directions (Юг, Север etc.)
router.get('/', function(req, res, next) {
  CompassDirectionsController.findAll(req.query).then(compass_directions => {
    res.jsend.success({compass_directions});
  }, next);
});
