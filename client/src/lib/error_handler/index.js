import Vue from 'vue';

import ErrorHandler from './lib';

Vue.use({
  install(Vue, options) {
    Vue.prototype.$err = new ErrorHandler({vue: Vue.prototype});
  }
});
