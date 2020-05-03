import CONFIG from '@/../config/client';

const cache = {};

window.uniCacheStorage = cache;

const disabledCache = [
  //"contractEntitycontract",
  // "walletID",
  // "contractPrivateKey",
  // "pairFromBOSS",
  // "keyEntityprivate",
  // "keyAddresses",
  // "keyAddressshort",
  // "keyAddresslong",
  // "TP",
  // "TPContract",
  // "TPDefData",
  // "contractDefData",
  // "contractDefinitionData",
  // "contractJsObject",
  // "contractLabelkey",
  // "contractLabeltestnet",
  // "contractLabel"
];

export default {
  get(key, id) {
    if (!CONFIG.cacheEnabled || disabledCache.indexOf(key) !== -1) return;

    if (id === undefined) return;

    if (!cache[key]) cache[key] = {};
    return cache[key][id];
  },

  set(key, id, value) {
    if (!CONFIG.cacheEnabled || disabledCache.indexOf(key) !== -1) return value;

    if (id === undefined) return;

    if (!cache[key]) cache[key] = {};
    cache[key][id] = value;
    return value;
  }
};
