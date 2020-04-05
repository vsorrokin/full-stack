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
          button.btn(type="submit" :disabled="$v.$invalid") Next
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
    name: 'login-search-email',

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

      notify(step) {
        const texts = {
          search: 'Searching email',
          errorNotFound: 'Email not found',
          success: 'Email found'
        };

        return this.$helpers.notify({texts, step, self: this, overlay: false, errorDuration: 2000});
      },

      getEntity() {
        return this.$UDCAPI.call('/auth/api', {
          command: 'get_entity_by_email',
          args: {
            email: this.formData.email
          }
        });
      },

      async onSubmitValidationSuccess() {
        if (this.isLoading) return;
        this.isLoading = true;

        this.notify('search');

        let result;
        try {
          result = await this.getEntity();
        } catch (e) {
          console.error(e);
          this.notify('errorNotFound');
          this.isLoading = false;
          this.notification = null;
          return;
        }

        this.notify('success');
        this.isLoading = false;
        this.notification = null;

        if (result.data.identities.length > 1) {
          this.$helpers.go('login', {id: result.data.person_id});
        } else {
          this.$helpers.go('login', {id: result.data.person_id, keyId: result.data.identities[0].id});
        }
      }
    },

    components: {

    }
  };
</script>
