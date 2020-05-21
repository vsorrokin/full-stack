import Vue from 'vue';

import GraphqlRequest from './lib';

Vue.use({
  install(Vue, options) {
    Vue.prototype.$graphqlRequest = new GraphqlRequest({vue: Vue.prototype});
  }
});
