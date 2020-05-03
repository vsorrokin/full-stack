<template>
  <button class="btn-clean link"
          v-clipboard:copy="copySting"
          v-clipboard:success="textCopied"
          type="button">{{copyBtnText}}</button>
</template>

<script>
  export default {
    name: 'clipboard-button',

    data() {
      return {
        copyBtnText: 'Copy'
      }
    },

    props: {
      copySting: {
        type: String
      }
    },

    methods: {
      textCopied() {
        if (this.copyBtnText === 'Copied!') return;

        this.copyBtnText = 'Copied!';
        setTimeout(() => {
          this.copyBtnText = 'Copy';
        }, 1500);
      }
    }
  };
</script>
