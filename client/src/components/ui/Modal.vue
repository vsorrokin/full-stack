<template lang="jade">
  .modal(:class="{visible: active && isVisible}")
    template(v-if="active")
      .overlay(@click="hide")
      .modal-content-wrap
        .modal-content
          slot
</template>

<script>
  import { EventBus } from '@/plugins/event-bus.js';

  export default {
    name: 'modal',

    data() {
      return {
        isVisible: false
      }
    },

    watch: {
      active(val) {
        this.isVisible = val;
      }
    },

    mounted() {
      EventBus.$on('hideModal', () => {
        this.isVisible = false;
      });
    },

    methods: {
      hide() {
        this.$helpers.hideModal();
        this.onOverlayHide();
      }
    },

    props: {
      active: Boolean,
      onOverlayHide: {
        type: Function,
        default: () => {}
      }
    }
  };
</script>
