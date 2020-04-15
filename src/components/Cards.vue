<template lang="jade">
  .cards
    .card-list-item(v-for="video in data" :key="video.id")
      v-card(:data="video")
</template>

<script>
import VCard from '#c/Card';

export default {
  name: 'card',
  
  props: {
    data: {
      type: Array,
      required: true,
      default() {
        return [];
      }
    }
  },

  components: {
    VCard
  }
}
</script>
