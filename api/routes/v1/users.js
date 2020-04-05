const express = require('express');
const usersController = require('../../controllers/users');

const router = module.exports = express.Router();

router.get('/', getUsers);

function getUsers(req, res, next) {
  //req.query
  
  usersController.findAll(query).then(users => {
    res.jsend.success({users});
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
}
