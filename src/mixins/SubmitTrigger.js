export default {
  watch: {
    vuelidateTrigger: {
      handler: function(value) {
        this.onSubmit();
      },
    }
  },
  props: {
    vuelidateTrigger:  {
      type: String
    }
  }
}
