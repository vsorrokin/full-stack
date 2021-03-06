import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import Getters from './getters';

Vue.use(Vuex);

const getters = Getters(Vue.prototype);

const state = {
  token: null,
  mounted: false,
  posts: []
};

export function createStore() {
  return new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: process.env.NODE_ENV === 'development'
  });
}
