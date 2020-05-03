<template lang="jade">
  div
    router-link.btn(:to="{name: 'new'}") New video
    br
    br
    button.btn(@click="logout") Logout

</template>

<script>
export default {
  name: 'dashboard-page',
  
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$store.commit('token', null);
    }
  },

  components: {

  }
}
</script>
