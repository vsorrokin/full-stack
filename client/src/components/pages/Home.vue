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
          cover {
            id,
            options
          },
          video {
            id
          },
          song_link,
          description
        }
      }`,
      result(res) {
        console.log(res);
      },
      error(error) {
       console.error('Vue Apollo error', error.message);
     },
     prefetch: false
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
