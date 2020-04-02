// Dependencies
var express = require('express');

// Define router and export it
var router = module.exports = express.Router();

// API versions
router.use('/v1', require('./v1'));
