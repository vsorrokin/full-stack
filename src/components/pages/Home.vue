<template lang="jade">
  div Home page
</template>

<script>
export default {
  name: 'home-page',

  async asyncData ({ store, route }) {
    const data = await new Promise(function(resolve, reject) {
      setTimeout(() => resolve(true), 100);
    });

    return data;
  },

  data() {
    return {
    };
  },

  components: {

  }
}
</script>
