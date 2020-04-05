<template lang="jade">
  .input-container.select-container(:class="{'input-container-invalid': isInvalid}")

    .error-wrapper(v-if='isInvalid')
      .error-text
        div(v-for='(message, ruleName) in validationErrorMessages', :key='message.id')
          p.validation-message.font-caption.visible(:data-test-validation-name='ruleName') {{ message.text }}
    slot

</template>

<script>


  export default {
    name: 'select-with-validation',

    props: {
      validationMessages: {
        type: Object
      },
      validationState: {
        type: Object
      }
    },

    computed: {
      isInvalid() {
        if (this.validationState) {
          return this.validationState.$error;
        } else {
          return false;
        }
      },

      validationErrorMessages() {
        const errors = {};

        const ruleNames = Object.keys(this.validationMessages);

        for (let i = 0, l = ruleNames.length; i < l; i++) {
          const ruleName = ruleNames[i];
          if (!this.validationState[ruleName]) {
            errors[ruleName] = this.validationMessages[ruleName];
            return errors;
          }
        }

        return errors;
      }
    }
  };
</script>
