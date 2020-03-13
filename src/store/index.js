import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import actions from './actions';
import Getters from './getters';

Vue.use(Vuex);

const getters = Getters(Vue.prototype);

const state = {
  isAuthenticated: false,
  activeModalName: null,
  modalSettings: {},
  user: null,
  mode: 'sugar',
  accounts: null,
  lastOperation: null,
  showTopup: false
};

export default async function() {
  const vue = Vue.prototype;

  // await vue.$storage.init();
  // const localStorageState = await vue.$storage.getFullState();
  //
  // Object.assign(state, localStorageState);

  return new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    strict: process.env.NODE_ENV === 'development'
  });
}
