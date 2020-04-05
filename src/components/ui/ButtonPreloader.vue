<template>
  <component :is="tag" :type="type" class="btn preloader"
             :class="{loading, success, invalid: validationMessages}">
    <i  :class="{visible: selected && !success}"
        class="icon-check selected"></i>
    <span>{{text}}</span>
    <slot></slot>
    <i class="icon-spinner"></i>
    <i class="icon-check done"
       data-test-id="button-success-icon"></i>

    <i v-if="validationMessages" class="input-icon icon-attention"></i>

    <!-- Validation errors -->
    <div class="error-wrapper" v-if="validationMessages">
      <div class="error-text">
        <p class="validation-message font-caption visible">{{ validationMessages }}</p>
      </div>
    </div>
  </component>
</template>

<script>
  export default {
    name: 'button-preloader',

    props: {
      tag: {
        type: String,
        default: 'button'
      },
      type: {
        type: String,
        default: 'button'
      },
      text: {
        type: String,
        default: 'Send'
      },
      loading: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Boolean,
        default: false
      },
      success: {
        type: Boolean,
        default: false
      },
      validationMessages: {
        type: String,
        default: ''
      }
    }
  };
</script>
