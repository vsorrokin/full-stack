<template lang="jade">
  #app.body-container
    v-navbar
    router-view
</template>

<script>
import '@/assets/stylesheets/main.styl';

import VNavbar from '#c/Navbar';

export default {
  name: 'App',

  components: {
    VNavbar
  }
}
</script>
