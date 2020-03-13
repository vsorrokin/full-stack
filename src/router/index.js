import Vue from 'vue';
import Router from 'vue-router';
import routes from '@/router/routes.js';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  fallback: false,
  scrollBehavior: () => ({ y: 0 }),
  routes
});

export default router;
