<template lang="jade">
  #admin-login
    .complex-title
      .text
        h4 Log In
        p.subtitle Identify yourself
    .box
      form(@submit.prevent="onSubmit")
        v-input.box-content(
          label="Email"
          type="email"
          placeholder="Your email address"
          input-model="email"
        )
        
        v-input.box-content(
          label="Password"
          type="password"
          placeholder="Your password"
          input-model="password"
        )

        .box-content.with-form-btn
          button.btn(type="submit" :disabled="$v.$invalid || isLoading") Log me in
</template>

<script>
  import { required, email } from 'vuelidate/lib/validators';

  import ValidationConfigMixin from '@/mixins/ValidationConfig';
  import FormSubmitMixin from '@/mixins/FormSubmit';

  const validationRules = function(self) {
    return {
      formData: {
        email: {
          required: {
            rule: required,
            message: 'Email is required'
          },
          email: {
            rule: email,
            message: 'Enter correct email'
          }
        },
        password: {
          required: {
            rule: required,
            message: 'Password is required'
          }
        }
      }
    }
  };

  export default {
    name: 'login-form',

    mixins: [
      FormSubmitMixin,
      ValidationConfigMixin(validationRules)
    ],

    data() {
      return {
        formData: {
          email: '',
          password: ''
        },
        isLoading: false,
        notification: null
      }
    },

    methods: {

      async onSubmitValidationSuccess() {
        const result = await this.$APIRequest.run({
          scope: this,
          endpoint: 'auth/login',
          data: {
            email: this.formData.email,
            password: this.formData.password,
          },
          msg: {
            start: 'Authorizing',
            error: 'dddd',
            success: 'Login success'
          }
        });
        
        if (!result) return;
        
        localStorage.setItem('token', result.token);
        this.$store.commit('token', result.token);
      }
    },

    components: {

    }
  };
</script>
