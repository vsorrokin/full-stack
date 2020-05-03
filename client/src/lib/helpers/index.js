import Vue from 'vue';

import Helpers from './lib';

Vue.use({
  install(Vue, options) {
    Vue.prototype.$helpers = new Helpers({vue: Vue.prototype});
  }
});
