<template lang="jade">
  .card-wrap
    .card(v-perspective)
      .image-wrap: .image(:style="bg")
      .shadow-wrap: .shadow(:style="bg")
</template>

<script>
export default {
  name: 'card',

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  computed: {
    bg() {
      const coverURL = this.$API.getURL(`file/${this.data.cover_id}`);
      
      return {'background-image': `url(${coverURL})`}
    }
  }
}
</script>
