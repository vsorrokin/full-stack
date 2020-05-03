function setFieldFocus(fieldContainer) {
  const input = fieldContainer.querySelector('input');
  const textarea = fieldContainer.querySelector('textarea');

  if (input) input.focus();
  if (textarea) textarea.focus();
}

export default {
  methods: {

    goToErrorField: function() {
      this.$v.$touch();

      setTimeout(() => {
        const firstErrorFieldContainer = document.querySelector('.input-container-invalid');

        if (!firstErrorFieldContainer) return;

        if (firstErrorFieldContainer.classList.contains('select-container')) return;

        setTimeout(() => {
          setFieldFocus(firstErrorFieldContainer);
        });

        if(!this.$store.state.activeModalName) {
          this.$scrollTo(firstErrorFieldContainer, 300, {offset: -20});
        }
      });
    },

    onSubmit: function () {
      if (this.$v.$invalid) {
        this.goToErrorField();
        return;
      }

      if (this.onSubmitValidationSuccess) {
        this.onSubmitValidationSuccess();
      } else {
        console.warn('You should create "onSubmitValidationSuccess" method in your component');
      }
    }
  }
}
