const path = require('path');
const express = require('express');
const passport = require('passport');
const filesController = require('../../controllers/files');

const router = module.exports = express.Router();

router.get('/:id', (req, res, next) => {

  filesController.findOneById(req.params.id).then(file => {
    res.sendFile(path.resolve(`${GCONFIG.API.fileStoragePath}/${file.local_name}`), {
      headers: {
        'Content-Type': file.type
      }
    });
  }, next).catch(next);

});
