import Vue from 'vue';

export default {
  user(state, payload) {
    state.user = payload;
  },

  showTopup(state, payload) {
    state.showTopup = payload;
  },

  lastOperation(state, payload) {
    state.lastOperation = payload;
  },

  accounts(state, payload) {
    state.accounts = payload;
  },

  isAuthenticated(state, payload) {
    state.isAuthenticated = payload;
  },

  modalSettings(state, payload) {
    state.modalSettings = payload || {};
  },

  modalSetting(state, payload) {
    for (let key in payload) {
      Vue.set(state.modalSettings, key, payload[key]);
    }
  },

  updateArrayItem(state, payload = {}) {
    if (!('data' in payload)) return;
    const {model, data, key} = payload;
    if (!key || !model || !state[model]) return;

    const foundItemIndex = state[model].findIndex(it => {
      return it[key] === data[key];
    });

    if (foundItemIndex === -1) {
      state[model].push(data);
    } else {
      Vue.set(state[model], foundItemIndex, data);
    }
  },

  showModal(state, payload) {
    state.activeModalName = payload.name;
    state.modalSettings = payload.settings;

    bodyScroll.stop();
  },

  activeModalName(state, payload) {
    state.activeModalName = payload;
  }
}
