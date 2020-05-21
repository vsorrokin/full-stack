import Vue from 'vue';

import APIRequest from './lib';

Vue.use({
  install(Vue, options) {
    Vue.prototype.$APIRequest = new APIRequest({vue: Vue.prototype});
  }
});
