const express = require('express');
const multer  = require('multer');
const path    = require('path');
const filesController = require('../../controllers/files');

const router = module.exports = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('../../../web_storage/my_ig'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

var upload = multer({
  storage,
  limits: {
    fileSize: (1024 * 1024) * 100, //100MB
    files: 1
  }
});

router.post('/video', upload.single('file'), (req, res, next) => {
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
