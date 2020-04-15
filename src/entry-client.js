import Vue from 'vue';

import '@/plugins/notifications';

import { createApp } from './app';

const buildConfig = require('@/../config/main');

if (buildConfig.mode === 'SPA') {
  const DOMRoot = document.createElement("div");
  DOMRoot.setAttribute('id', 'app');
  document.body.childNodes[1].replaceWith(DOMRoot);
}

Vue.mixin({
  beforeRouteUpdate(to, from, next) {
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

  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to);
    const prevMatched = router.getMatchedComponents(from);

    let diffed = false;
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c));
    });

    if (!activated.length) {
      return next();
    }

    Promise.all(activated.map(c => {
      if (c.asyncData) {
        return c.asyncData({ store, route: to });
      }
    })).then(() => {
      next();
    }).catch(next);
  });

  app.$mount('#app');
});


if (module.hot) {
  const api = require('vue-hot-reload-api');
  const Vue = require('vue');

  api.install(Vue);

  if (!api.compatible) {
    throw new Error(
      'vue-hot-reload-api is not compatible with the version of Vue you are using.',
    );
  }

  module.hot.accept();
}
