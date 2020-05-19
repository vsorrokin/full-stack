import Vue from 'vue';

import NetworkAction from './lib';

Vue.use({
  install(Vue, options) {
    Vue.prototype.$networkAction = new NetworkAction({vue: Vue.prototype});
  }
});
