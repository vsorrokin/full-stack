// Express body parse for json requests support
const bodyParser = require('body-parser');
const express = require('express');
// Lib for formatted response like {status: "success", data: {...}}
const jsend = require('jsend');

const router = module.exports = express.Router();

// Apply middlewares
router.use(bodyParser.json());
router.use(jsend.middleware);

// Connect routes
router.use('/users', require('./users'));
