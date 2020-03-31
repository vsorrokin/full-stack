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
    settings: {
      type: Object,
      required: true
    }
  },

  computed: {
    bg() {
      return {'background-image': `url(${this.settings.preview})`}
    }
  }
}
</script>
