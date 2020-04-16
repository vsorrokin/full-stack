const passport    = require('passport');
const passportJWT = require("passport-jwt");
const bcrypt      = require('bcrypt');

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;

const credentials = require('../config/credentials');
const usersController = require('../controllers/users');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async function (email, password, cb) {

    let user;

    try {
      user = await usersController.findOneByEmail(email);
    } catch (e) {
      console.log(err);
      return cb(err);
    }

    if (!user) {
      return cb({code: 'incorrect_login_credentials'});
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return cb({code: 'incorrect_login_credentials'});
    }

    return cb(null, user);
  }
));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: credentials.jwtSecret
  },
  function (jwtPayload, cb) {
    return usersController.findOneById(jwtPayload.id)
      .then(user => {
        return cb(null, user);
      })
      .catch(err => {
        return cb(err);
      });
    }
));
