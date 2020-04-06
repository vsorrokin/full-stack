import Vue from 'vue';
import App from '@/components/App';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';
import { createRouter } from './router';

import '@/plugins/axios';
import '@/plugins/vuelidate';
import '@/plugins/debounce';

import '@/lib/helpers';
import '@/lib/api';


import VInput from '#c/ui/Input';
Vue.component('VInput', VInput);
Vue.directive('focus', { inserted(el, binding) { if (binding.value) el.focus()} });

import '@/directives/perspective';

export function createApp(context) {
  const router = createRouter();
  const store = createStore();

  //sync(store, router);

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}
