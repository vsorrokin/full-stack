<template lang="jade">
  .card-wrap
    .card(v-perspective :class="{mouseentered: mouseentered}" @mouseenter="mouseenter" @mouseleave="mouseleave")
      .image-wrap
        video(preload="none" ref="video" playsinline type="video/mp4" :src="video" :poster="poster")
        .image(:style="bg")
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
  
  data() {
    return {
      mouseentered: false
    }
  },

  computed: {
    bg() {
      const coverURL = this.$APIRequest.getURL(`file/${this.data.cover_id}`);
      
      return {'background-image': `url(${coverURL})`}
    },
    
    poster() {
      return this.$APIRequest.getURL(`file/${this.data.cover_id}`);
    },
    
    video() {
      return this.$APIRequest.getURL(`file/${this.data.video_id}`);
    }
  },
  
  methods: {
    mouseenter() {
      this.mouseentered = true;
      this.$refs.video.play();
    },
    
    mouseleave() {
      this.mouseentered = false;
      this.$refs.video.pause();
    }
  }
}
</script>
