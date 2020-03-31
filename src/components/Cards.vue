<template lang="jade">
  .cards
    .card-list-item(v-for="video in videos" :key="video.id")
      v-card(:settings="{preview: video.preview}")
</template>

<script>
import VCard from '#c/Card';

import videos from '@/store/mock/videos';

export default {
  name: 'card',

  data() {
    return {
      videos
    }
  },

  components: {
    VCard
  }
}
</script>
