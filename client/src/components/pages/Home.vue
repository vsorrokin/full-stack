<template lang="jade">
  .content-wrap
    .content
      v-cards(:data="posts")

</template>

<script>
import VCards from '#c/Cards';

import gql from 'graphql-tag';

export default {
  name: 'home-page',
  
  apollo: {
    posts: {
      query: gql`query {
        posts {
          id,
          video_id,
          cover_id,
          song_link,
          description
        }
      }`,
      error(error) {
       console.error('Vue Apollo error', error.message);
      }
    }
  },

  // asyncData ({ store, route }) {
  //   return store.dispatch('posts');
  // },

  components: {
    VCards
  }
}
</script>
