import Vue from 'vue';
import App from '@/components/App';
import Store from '@/store';
import { sync } from 'vuex-router-sync';
import router from '@/router';

async function initVue() {
  const store = await Store();

  store.vueRouter = router;
  router.vueStore = store;
  Vue.prototype.store = store;

  sync(store, router);

  window.VueUniversaApp = new Vue({
    el: '#app',
    router,
    store,
    //i18n,
    render: h => h(App)
  });
}

initVue();
