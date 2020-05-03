import Vue from 'vue';

export default {
  posts(state, payload) {
    state.posts = payload;
  },

  token(state, payload) {
    state.token = payload;
  },

  mounted(state, payload) {
    state.mounted = payload;
  }
}
