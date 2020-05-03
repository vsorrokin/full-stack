const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = module.exports = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {

    if (err || !user) {
      return res.status(400).jsend.fail(err);
    }

    user = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name
    };

    const token = jwt.sign(user, GSECRET.jwtSecret, {expiresIn: '30000m'});

    return res.jsend.success({user, token});

  })(req, res);
});
