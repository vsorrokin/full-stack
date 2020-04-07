<template lang="jade">
  #app.body-container
    notifications(
      classes="vue-notification"
      position="bottom left"
      width="194"
      animation-type="velocity")
    v-navbar
    router-view
</template>

<script>
import '@/assets/stylesheets/main.styl';

import VNavbar from '#c/Navbar';

export default {
  name: 'App',
  
  mounted() {
    this.$store.commit('token', localStorage.getItem('token'));
    this.$store.commit('mounted', true);
    
    this.initRouter();
  },
  
  methods: {
    initRouter() {
      this.$nextTick(() => {
        if (!this.$store.state.token && !this.$route.meta.isPublic) {
          this.$router.push({name: 'home'});
          return;
        }
      });
    }
  },

  components: {
    VNavbar
  }
}
</script>
