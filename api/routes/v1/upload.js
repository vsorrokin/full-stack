const express = require('express');
const multer  = require('multer');
const path    = require('path');
const filesController = require('../../controllers/files');

const router = module.exports = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, GCONFIG.API.fileStoragePath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

router.post('/:type', (req, res, next) => {

  const type = req.params.type;
  const allowedTypes = ['video', 'cover'];

  if (!allowedTypes.includes(type)) {
    return res.status(400).jsend.fail({code: 'incorrect_upload_type'});
  }

  var upload = multer({
    storage,
    limits: {
      fileSize: (1024 * 1024) * GCONFIG.maxFileSize[type], //100MB
      files: 1
    }
  }).single('file');

  upload(req, res, function(err) {

      if(err) {
        return res.status(400).jsend.fail({code: err.code, message: err.message});
      }

      const file = {
        name: req.file.originalname,
        type: req.file.mimetype,
        size: req.file.size,
        local_name: req.file.filename
      };

      filesController.create(file).then(files => {
        res.jsend.success({
          ...file,
          id: files[0].id
        });
      }, next);
  });

});
