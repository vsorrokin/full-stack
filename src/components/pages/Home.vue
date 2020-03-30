<template lang="jade">
  div(style="padding: 100px 500px")
    .card(v-perspective)
      .image
      .shadow

</template>

<script>
export default {
  name: 'home-page',

  async asyncData ({ store, route }) {
    const data = await new Promise(function(resolve, reject) {
      setTimeout(() => resolve(true), 100);
    });

    return data;
  }
}
</script>
