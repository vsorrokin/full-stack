const bodyParser = require('body-parser');
const express = require('express');
const jsend = require('jsend');
const passport = require('passport');

const router = module.exports = express.Router();

// Apply middlewares
router.use(bodyParser.json());
router.use(jsend.middleware);

// Connect routes
router.use('/auth', require('./auth'));
//router.use('/post', require('./post'));
router.use('/file', require('./file'));
//router.use('/upload', passport.authenticate('jwt', {session: false}), require('./upload'));
