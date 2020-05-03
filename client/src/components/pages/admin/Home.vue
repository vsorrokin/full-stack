<template lang="jade">
  .content-wrap.tight
    .content(v-if="$store.state.mounted")
      v-login(v-if="!$store.state.token")
      v-dashboard(v-else)

</template>

<script>
import VLogin from '#c/forms/admin/auth/Login';
import VDashboard from '#c/admin/Dashboard';

export default {
  name: 'admin-page',

  components: {
    VLogin,
    VDashboard
  }
}
</script>
