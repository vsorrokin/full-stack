<template lang="jade">
  .content-wrap
    .content
      v-cards

</template>

<script>
import VCards from '#c/Cards';

export default {
  name: 'home-page',

  // async asyncData ({ store, route }) {
  //   const data = await new Promise(function(resolve, reject) {
  //     setTimeout(() => resolve(true), 100);
  //   });
  //
  //   return data;
  // },

  components: {
    VCards
  }
}
</script>
