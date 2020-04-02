const Promise = require('bluebird');
const express = require('express');
const kinds = require('./constants');
const schema = require('./schema');
const events = require('./events');
const lotsController = require('../../../controllers/lots');

const router = module.exports = express.Router();

router.post('/call-me', makeSubmitFormHandler(kinds.CALL_ME));
router.post('/leave-request', makeSubmitFormHandler(kinds.LEAVE_REQUEST));
router.post('/subscribe', makeSubmitFormHandler(kinds.SUBSCRIBE));
router.post('/sell-object', makeSubmitFormHandler(kinds.SELL_OBJECT));
router.post('/request-preview', makeSubmitFormHandler(kinds.REQUEST_PREVIEW));
router.post('/inform-action', makeSubmitFormHandler(kinds.INFORM_ACTION));
router.post('/suggest-price', makeSubmitFormHandler(kinds.SUGGEST_PRICE));
router.post('/layout-request', makeSubmitFormHandler(kinds.LAYOUT_REQUEST));
router.post('/feedback', makeSubmitFormHandler(kinds.FEEDBACK));
router.post('/personal-offer', makeSubmitFormHandler(kinds.PERSONAL_OFFER));

const PRICE_PER_REQUEST = 'По запросу';
const RUR = 'руб.';
const RUR_SQM = 'руб. / м2';
const UNIT_ALL = 'all';
const UNIT_SQM = 'sqm';

const PRICE_UNIT_DESC = {
  [UNIT_ALL]: RUR,
  [UNIT_SQM]: RUR_SQM,
};

function makeServerErrorResponse(res, err) {
  console.error(err);
  res.status(500).jsend.fail({ message: 'Server Error' });
}

function makeClientErrorResponse(res, err) {
  res.status(400).jsend.fail({ message: err.message, errors: err.nestedErrors || [] });
}

/**
 * Makes the Error server resonse
 * @param res {object}
 * @param err {Error}
 */
function makeErrorResponse(res, err) {
  if(err.hasOwnProperty('nestedErrors')) {
    return makeClientErrorResponse(res, err);
  }
  return makeServerErrorResponse(res, err);
}

/**
 * Makes the OK message
 * @param res {object}
 * @param data {object} Not used now.
 */
function makeOkResponse(res, data) {
  res.jsend.success(data);
}

/**
 * Gets the string representation of a price unit
 * @param unit {string}
 * @return {string}
 */
function getPriceUnitStr(unit) {
  return (PRICE_UNIT_DESC[unit] || PRICE_UNIT_DESC[UNIT_ALL]);
}

/**
 * Gets the object price
 * @param pageUrl {string}
 * @param lot {object}
 * @return {{ price, unit }}
 */
function getObjectPrice(pageUrl, lot) {
  pageUrl = pageUrl || '';
  const prices = lot.prices_obj || {};
  const basePrices = prices.base || {};

  // SALE or LEASE
  let price = 0;
  let unit = UNIT_ALL;
  if(pageUrl.indexOf('arenda') !== -1) {
    price = basePrices.lease.from;
    unit = UNIT_SQM;
  }

  if(!price) {
    const area = lot.area_from || 1;
    const sellPrice = (basePrices.sell ? basePrices.sell.from : 0);
    price = sellPrice * area;
    unit = UNIT_ALL;
  }

  return {
    price: Math.round(price || 0),
    unit: unit, // 'sqm', 'all'
  };
}

/**
 * Formats price as a string
 * If no price found, set `По запросу`
 * @param pageUrl {string}
 * @param lot {object}
 * @return {string}
 */
function formatPrice(pageUrl, lot) {
  const objPrice = getObjectPrice(pageUrl, lot);
  if(!objPrice.price) {
    return PRICE_PER_REQUEST;
  }

  const value = '' + objPrice.price;
  return value.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1 ') + ` ${getPriceUnitStr(objPrice.unit)}`;
}

/**
 * Formats the message
 * @param msg {object}
 * @return {object}
 */
function formatMessage(msg) {
  if(msg.hasOwnProperty('huu')) {
    return lotsController
      .find({ url_id: msg.huu })
      .then(lot => {
        if(!lot) {
          const err = new Error(`Object ${msg.huu} not found`);
          err.nestedErrors = [{ field: 'huu', message: 'Object not found' }];
          return Promise.reject(err);
        }

        return { ...msg, price: formatPrice(msg.page_url, lot) };
      });
  }

  return Promise.resolve(msg);
}

function makeSubmitFormHandler(kind) {
  return (req, res) => {
    const data = req.body;
    schema.validate(kind, data)
      .then(data => formatMessage(data))
      .then(data => events.raise(kind, data))
      .then(data => {
        makeOkResponse(res, data);
      })
      .catch(err => {
        makeErrorResponse(res, err);
      });
  };
}
