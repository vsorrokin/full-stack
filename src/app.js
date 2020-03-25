import Vue from 'vue';
import App from '@/components/App';
import { createStore } from './store';
import { sync } from 'vuex-router-sync';
import { createRouter } from './router';

export function createApp(context) {
  const router = createRouter();
  const store = createStore();

  sync(store, router);

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  });

  return { app, router, store };
}
