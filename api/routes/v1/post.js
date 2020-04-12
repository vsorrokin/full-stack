const express = require('express');
//const filesController = require('../../controllers/files');

const router = module.exports = express.Router();


router.post('/', (req, res, next) => {

  filesController.create(file).then(files => {
    res.jsend.success({
      ...file,
      id: files[0].id
    });
  }, next);

});
