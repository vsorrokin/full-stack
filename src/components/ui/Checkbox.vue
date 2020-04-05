<template lang="jade">
  label.checkbox
    input(
      type='checkbox'
      :checked='value'
      :disabled='disabled'
      ref='input'
      :data-test-input-name='inputName'
      @change='updateValue'
    )
    .checkbox-emulator
      .latch
        i.icon-check
    span.label-text(v-html='label')

</template>

<script>
  export default {
    name: 'checkbox',

    props: ['value', 'label', 'disabled', 'inputName'],

    methods: {
      updateValue(e) {
        this.$emit('input', e.target.checked);
      }
    },
  };
</script>
