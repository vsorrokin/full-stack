import Vue from 'vue';

import { createApp } from './app';

const buildConfig = require('@/../config/build');

if (buildConfig.mode === 'SPA') {
  const DOMRoot = document.createElement("div");
  DOMRoot.setAttribute('id', 'app');
  document.body.childNodes[1].replaceWith(DOMRoot);
}

Vue.mixin({
  beforeRouteUpdate (to, from, next) {
    const { asyncData } = this.$options
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to
      }).then(next).catch(next)
    } else {
      next()
    }
  }
});

const { app, router, store } = createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

router.onReady(() => {
  app.$mount('#app');
});
