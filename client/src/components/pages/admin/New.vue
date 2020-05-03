<template lang="jade">
  .content-wrap.tight
    .content
      v-new-post

</template>

<script>
import VNewPost from '#c/forms/admin/NewPost';

export default {
  name: 'new-post-page',

  components: {
    VNewPost
  }
}
</script>
