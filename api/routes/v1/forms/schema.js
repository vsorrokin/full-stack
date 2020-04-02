const Promise = require('bluebird');
const inspector = require('schema-inspector');
const kinds = require('./constants');

// Schema for form validation

const CALL_ME_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    page_url: { type: 'string', minLength: 1 },
  }
};

const LEAVE_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: 'email' },
    phone: { type: 'string', minLength: 1 },
    comment: { type: 'string', optional: true },
    page_url: { type: 'string', minLength: 1 },
  }
};

const SUBSCRIBE_SCHEMA = {
  type: 'object',
  properties: {
    email: { type: 'string', pattern: 'email' },
    subject: { type: 'array', items: { type: 'string', pattern: /news|residential|commercial/ } },
    freq: { type: 'array', items: { type: 'string', pattern: /weekly|monthly/ } },
    page_url: { type: 'string', minLength: 1 },
  }
};

const SELL_OBJECT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: 'email' },
    phone: { type: 'string', minLength: 1 },
    comment: { type: 'string', optional: true },
    page_url: { type: 'string', minLength: 1 },
  }
};

const REQUEST_PREVIEW_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: 'email' },
    phone: { type: 'string', minLength: 1 },
    huu: { type: 'string', minLength: 1 },
    object_name: { type: 'string', minLength: 1 },
    page_url: { type: 'string', minLength: 1 },
  }
};

const INFORM_ACTION_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    huu: { type: 'string', minLength: 1 },
    object_name: { type: 'string', minLength: 1 },
    page_url: { type: 'string', minLength: 1 },
  }
};

const SUGGEST_PRICE_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: 'email' },
    phone: { type: 'string', minLength: 1 },
    huu: { type: 'string', minLength: 1 },
    proposed_price: { type: 'string', minLength: 1 },
    object_name: { type: 'string', minLength: 1 },
    page_url: { type: 'string', minLength: 1 },
  }
};

const LAYOUT_REQUEST_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: 'email' },
    phone: { type: 'string', minLength: 1 },
    huu: { type: 'string', minLength: 1 },
    object_name: { type: 'string', minLength: 1 },
    page_url: { type: 'string', minLength: 1 },
  }
};

const FEEDBACK_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    phone: { type: 'string', minLength: 1 },
    comment: { type: 'string', minLength: 1 },
  }
};

const PERSONAL_OFFER_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', pattern: 'email' },
    phone: { type: 'string', minLength: 1 },
    object_name: { type: 'string', minLength: 1 },
    page_url: { type: 'string', minLength: 1 },
  }
};

const SCHEMAS = {
  [kinds.CALL_ME]: CALL_ME_SCHEMA,
  [kinds.LEAVE_REQUEST]: LEAVE_REQUEST_SCHEMA,
  [kinds.SUBSCRIBE]: SUBSCRIBE_SCHEMA,
  [kinds.SELL_OBJECT]: SELL_OBJECT_SCHEMA,
  [kinds.REQUEST_PREVIEW]: REQUEST_PREVIEW_SCHEMA,
  [kinds.INFORM_ACTION]: INFORM_ACTION_SCHEMA,
  [kinds.SUGGEST_PRICE]: SUGGEST_PRICE_SCHEMA,
  [kinds.LAYOUT_REQUEST]: LAYOUT_REQUEST_SCHEMA,
  [kinds.FEEDBACK]: FEEDBACK_SCHEMA,
  [kinds.PERSONAL_OFFER]: PERSONAL_OFFER_SCHEMA,
};

module.exports.validate = validate;

/**
 * Extract field name from property, returned by `schema-inspector`
 * @param propName {string}
 * @return {string}
 */
function propertyToName(propName) {
  const parts = propName.split('.');
  if(parts.length < 2) {
    throw new Error(`Cannot parse propName: ${propName}`);
  }
  const fullName = parts[1] || '';

  const bracketIndex = fullName.indexOf('[');
  if(bracketIndex !== -1) {
    return fullName.substring(0, bracketIndex);
  }

  return fullName;
}

/**
 * Extract validation errors
 * @param result {object} { error: [ { code: {string}, reason: {string}, message: {string}, property: {string} } ]}
 */
function getValidationErrors(result) {
  return (result.error || []).map(err => ({ field: propertyToName(err.property), message: err.message }));
}

/**
 * Validate schema for the given kind.
 * @param kind {string}
 * @param data {object}
 * @return {Promise}
 */
function validate(kind, data) {
  const schema = SCHEMAS[kind];
  if(!schema) {
    return Promise.reject(new Error(`Invalid schema for: ${kind}`));
  }

  const result = inspector.validate(schema, data);
  if(!result.valid) {
    const err = new Error('Validation failed');
    err.nestedErrors = getValidationErrors(result);
    return Promise.reject(err);
  }

  return Promise.resolve(data);
}
