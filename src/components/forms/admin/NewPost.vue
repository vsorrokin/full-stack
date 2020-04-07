<template lang="jade">
  #admin-login
    .complex-title
      router-link.bordered-icon(:to="{name: 'admin'}"): i.icon-arrow-left
      .text
        h4 New video
        p.subtitle Add new video to feed
    .box
      form(@submit.prevent="onSubmit")
        .box-content
          v-upload(:settings="{label: 'Select video', endpoint: 'video'}")
          
        .box-content
          v-upload(:settings="{label: 'Select cover'}")
        
        v-input.box-content(
          label="Song link"
          placeholder="Link to song from video"
          input-model="songLink"
        )

        .box-content.with-form-btn
          button.btn(type="submit" :disabled="$v.$invalid || isLoading") Create and save
</template>

<script>
  import { required, email } from 'vuelidate/lib/validators';

  import ValidationConfigMixin from '@/mixins/ValidationConfig';
  import FormSubmitMixin from '@/mixins/FormSubmit';
  
  import VUpload from '#c/ui/Upload';

  const validationRules = function(self) {
    return {
      formData: {
        video: {
          required: {
            rule: required,
            message: 'Video is required'
          }
        }
      }
    }
  };

  export default {
    name: 'new-post-form',

    mixins: [
      FormSubmitMixin,
      ValidationConfigMixin(validationRules)
    ],

    data() {
      return {
        formData: {
          video: null,
          cover: null,
          songLink: null
        },
        isLoading: false,
        notification: null
      }
    },

    methods: {
      async onSubmitValidationSuccess() {
        const result = await this.$helpers.run({
          scope: this,
          endpoint: 'auth/login',
          data: {
            email: this.formData.email,
            password: this.formData.password,
          },
          msg: {
            start: 'Authorizing',
            error: 'Invalid credentials',
            success: 'Login success'
          }
        });
        
        localStorage.setItem('token', result.token);
        this.$store.commit('token', result.token);
      }
    },

    components: {
      VUpload
    }
  };
</script>
