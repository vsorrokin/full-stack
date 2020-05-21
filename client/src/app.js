import Vue from 'vue';
import App from '@/components/App';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';
import { createRouter } from './router';
import createApolloProvider from '@/lib/apollo';

import '@/plugins/axios';
import '@/plugins/vuelidate';
import '@/plugins/debounce';

import '@/lib/helpers';
import '@/lib/api';
import '@/lib/network_action';
import '@/lib/error_handler';


import VInput from '#c/ui/Input';
Vue.component('VInput', VInput);
Vue.directive('focus', { inserted(el, binding) { if (binding.value) el.focus()} });

import '@/directives/perspective';

export function createApp(context) {
  const router = createRouter();
  const store = createStore();

  Vue.prototype.store = store;

  //sync(store, router);

  const apolloProvider = createApolloProvider(store);

  const app = new Vue({
    router,
    store,
    apolloProvider,
    render: h => h(App)
  });

  return { app, router, store, apolloProvider };
}
