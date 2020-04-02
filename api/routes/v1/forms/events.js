const Promise = require('bluebird');
const kinds = require('./constants');
const rmq = require('../../../lib/rabbitmq_service');

const serverType = process.env.SERVER_TYPE || 'dev';

// Events to send to RabbitMq

const ROUTING_KEY_OBJECT_VISITED = 'object.visited';
const ROUTING_KEY_FORM_CALL_ME = 'form.call_me';
const ROUTING_KEY_FORM_LEAVE_REQUEST = 'form.leave_request';
const ROUTING_KEY_FORM_SUBSCRIBE = 'form.subscribe';
const ROUTING_KEY_FORM_SELL_OBJECT = 'form.sell_object';
const ROUTING_KEY_FORM_REQUEST_PREVIEW = 'form.request_preview';
const ROUTING_KEY_FORM_INFORM_ACTION = 'form.inform_action';
const ROUTING_KEY_FORM_SUGGEST_PRICE = 'form.suggest_price';
const ROUTING_KEY_FORM_LAYOUT_REQUEST = 'form.layout_request';
const ROUTING_KEY_FORM_FEEDBACK = 'form.feedback';
const ROUTING_KEY_PERSONAL_OFFER = 'form.personal_offer';

const ROUTING_KEYS = {
  [kinds.OBJECT_VISITED]: ROUTING_KEY_OBJECT_VISITED,
  [kinds.CALL_ME]: ROUTING_KEY_FORM_CALL_ME,
  [kinds.LEAVE_REQUEST]: ROUTING_KEY_FORM_LEAVE_REQUEST,
  [kinds.SUBSCRIBE]: ROUTING_KEY_FORM_SUBSCRIBE,
  [kinds.SELL_OBJECT]: ROUTING_KEY_FORM_SELL_OBJECT,
  [kinds.REQUEST_PREVIEW]: ROUTING_KEY_FORM_REQUEST_PREVIEW,
  [kinds.INFORM_ACTION]: ROUTING_KEY_FORM_INFORM_ACTION,
  [kinds.SUGGEST_PRICE]: ROUTING_KEY_FORM_SUGGEST_PRICE,
  [kinds.LAYOUT_REQUEST]: ROUTING_KEY_FORM_LAYOUT_REQUEST,
  [kinds.FEEDBACK]: ROUTING_KEY_FORM_FEEDBACK,
  [kinds.PERSONAL_OFFER]: ROUTING_KEY_PERSONAL_OFFER,
};

module.exports.raise = raiseEvent;


/**
 * Adds a timestamp to the message, milliseconds
 * @param msg {object}
 * @return {object}
 */
function addTimestamp(msg) {
  return { ...msg, date: Math.trunc(Date.now() / 1000) };
}

/**
 * Adds the server type to the message
 * @param msg {object}
 * @return {object}
 */
function addServerType(msg) {
  return { ...msg, server_type: serverType };
}

/**
 * Report the event to rabbitmq
 * @param kind {string}
 * @param data {object}
 * @return {Promise}
 */
function raiseEvent(kind, data) {
  const routingKey = ROUTING_KEYS[kind];
  if(!routingKey) {
    return Promise.reject(new Error(`Invalid routingKey for: ${kind}`));
  }

  return rmq.open()
    .then((publisher) => {
      const msg = addServerType(addTimestamp(data));
      publisher(routingKey, JSON.stringify(msg));
      return msg;
    });
}
