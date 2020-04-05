<template>
  <div class="radio">
    <label>
      <input type="radio" :name="name" :value="value" v-model="radioButtonValue"/>
      <div class="radio-emulator">
        <div class="icon-checkmark"></div>
      </div><span class="label-text">{{label}}</span>
    </label>
  </div>
</template>

<script>
  export default {
    name: 'radio-button',

    model: {
      prop: 'selectedVal'
    },

    props: ['value', 'selectedVal', 'label', 'name'],

    computed: {
      radioButtonValue: {
        get() {
          return this.selectedVal;
        },
        set() {
          this.$emit("input", this.value);
        }
      }
    }
  };
</script>
