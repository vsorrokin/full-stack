<template lang="jade">
  .content-wrap
    .content
      v-login

</template>

<script>
import VLogin from '#c/forms/admin/auth/Login';

export default {
  name: 'admin-page',

  components: {
    VLogin
  }
}
</script>
