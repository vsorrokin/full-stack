const Promise = require('bluebird');
const express = require('express');
const lotsController = require('../../controllers/lots');

const router = module.exports = express.Router();

router.get('/', getLotOfMonth);

function getLotOfMonth(req, res, next) {
  const { segment_ids } = req.query;
  const query = {
    segment_ids: Number.parseInt(segment_ids),
    is_lot_of_month: true
  };

  if(Number.isNaN(query.segment_ids)) {
    res.status(404).jsend.fail({ message: 'lot not found' });
    return;
  }

  lotsController.find(query).then(lot => {
    if(lot) {
      res.jsend.success({lot});
    } else {
      res.status(404).jsend.fail({ message: 'lot not found' });
    }
  }).catch(err => {
    res.jsend.error(err.toString());
    next();
  });
}
