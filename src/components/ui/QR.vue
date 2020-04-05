<template lang="jade">
  .box.with-qr
    .qr-box(ref="qr")
</template>

<script>
  import qrcode from 'qrcode-generator';

  export default {
    name: 'qr',

    props: {
      data: {
        required: true
      }
    },

    watch: {
      data() {
        this.generateQR();
      }
    },

    methods: {
      generateQR() {
        if (!this.data) return;
        const qr = qrcode(0, 'H');
        qr.addData(this.data);
        qr.make();
        this.$refs.qr.innerHTML = qr.createImgTag(12, 0);
      }
    }
  };
</script>
