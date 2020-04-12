<template lang="jade">

  .input-container(:class="containerClass")
      label

        span.input-label(v-if="label" :class="{'with-postfix': labelPostfix}")
          span(v-html="label")
          span.label-postfix(v-if="labelPostfix") {{labelPostfix}}

        .input-wrap

          .prefix(v-if="prefix" v-html="prefix")

          textarea(
            v-if="type === 'textarea'"
            :placeholder="placeholder"
            :readonly="readonly"
            :disabled="disabled"
            :type="type"
            :value="value"
            @input="onInput($event.target.value)"
            @focus="isActive = true"
            @blur="onBlur"
            v-focus="autofocus"
            v-debounce="debounce"
          )
          input(
            v-else
            :placeholder="placeholder"
            :readonly="readonly"
            :disabled="disabled"
            :type="type"
            :value="value"
            @input="onInput($event.target.value)"
            @focus="onFocus"
            @blur="onBlur"
            v-focus="autofocus"
            v-debounce="debounce"
          )

          .postfix(v-if="postfix"): h3 {{postfix}}
          .postfix(v-if="copy")
            v-clipboard-button(:copy-sting="value")


          .error-wrapper(v-if="isInvalid")
            .error-text
              div(v-for="(message, ruleName) in validationErrorMessages" :key="message.id")
                p.validation-message(:data-test-validation-name='ruleName')
                  |{{ typeof message.text === 'function' ? message.text() : message.text }}

</template>

<script>
  import VMenu from '@/components/ui/Menu';
  import VClipboardButton from '@/components/ui/ClipboardButton'

  export default {
    name: 'v-input',
    props: {
      placeholder: {
        type: String,
        default: ''
      },
      debounce: {
        type: [Function, Boolean],
        default: () => {}
      },
      autofocus: {
        type: String,
        default: null
      },
      label: String,
      validationMessages: {
        type: Object
      },
      validationState: {
        type: Object
      },
      value: {
        type: [String, Number, Date],
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      readonly: {
        type: [Boolean, String],
        default: false
      },
      disabled: {
        type: [Boolean, String],
        default: false
      },
      copy: {
        type: [Boolean, String],
        default: false
      },
      postfix: {
        type: String,
        default: null
      },
      prefix: {
        type: String,
        default: null
      },
      labelPostfix: {
        type: String,
        default: null
      }
    },

    methods: {
      onInput(value) {
        this.touch();
        this.$emit('input', value);
      },

      onBlur() {
        this.$emit('blur');
        this.touch();
        this.isActive = false;
      },

      onFocus() {
        this.isActive = true;
        this.$emit('focus');
      },

      touch() {
        if (this.validationState) {
          this.validationState.$touch();
        }
      },

      selectorHandler(item) {
        this.$emit('on-select', item);
      },

      hideSelector() {
        this.isSelectorVisible = false;
      },

      toggleSelector() {
        if (!this.isSelectorVisible) {
          setTimeout(() => {
            this.isSelectorVisible = true;
          }, 50);
        } else {
          this.hideSelector();
        }
      }
    },

    computed: {
      containerClass() {
        return {
          'with-postfix': this.copy || this.postfix,
          'input-container-invalid': this.isInvalid
        };
      },
      
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
    },

    data () {
      return {
       isActive: false,
       validationMesssages: {},
       isSelectorVisible: false
      }
    },

    components: {
      VMenu,
      VClipboardButton
    }
  };
</script>
