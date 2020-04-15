<template lang="jade">
  .content-wrap
    .content
      v-cards(:data="$store.state.posts")

</template>

<script>
import VCards from '#c/Cards';

export default {
  name: 'home-page',

  asyncData ({ store, route }) {
    return store.dispatch('posts');
  },

  components: {
    VCards
  }
}
</script>
