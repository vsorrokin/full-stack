import Vue from 'vue';

import API from './lib';

Vue.use({
  install(Vue, options) {
    Vue.prototype.$API = new API({vue: Vue.prototype});
  }
});
