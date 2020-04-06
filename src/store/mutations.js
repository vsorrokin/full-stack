import Vue from 'vue';

export default {
  token(state, payload) {
    state.token = payload;
  },

  mounted(state, payload) {
    state.mounted = payload;
  }
}
