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
          v-upload(:settings="{label: 'Select video', type: 'video'}" v-model="formData.video")
          
        .box-content
          v-upload(:settings="{label: 'Select cover', type: 'cover'}" v-model="formData.cover")
        
        v-input.box-content(
          label="Song link"
          placeholder="Link to song from video"
          input-model="songLink"
        )
        
        v-input.box-content(
          type="textarea"
          label="Description"
          placeholder="Video description"
          input-model="description"
        )

        .box-content.with-form-btn
          button.btn(type="submit" :disabled="$v.$invalid || isLoading || !allFilesUploaded") 
            |{{uploadInProgress ? 'File uploading' : 'Create and save'}}
</template>

<script>
  import getProp from 'lodash/get';
  import Autosize from 'autosize';
  import { required } from 'vuelidate/lib/validators';

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
        },
        cover: {
          required: {
            rule: required,
            message: 'Cover is required'
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
    
    mounted() {
      Autosize(document.querySelector('textarea'));
    },
    
    computed: {
      uploadInProgress() {
        return this.formData.video && this.formData.cover && !this.allFilesUploaded;
      },
      
      allFilesUploaded() {
        return this.formData.video && this.formData.video.id &&
               this.formData.cover && this.formData.cover.id;
      }
    },
    
    data() {
      return {
        formData: {
          video: null,
          cover: null,
          songLink: null,
          description: null
        },
        isLoading: false,
        notification: null
      }
    },

    methods: {
      async onSubmitValidationSuccess() {
        const result = await this.$helpers.run({
          scope: this,
          endpoint: 'post',
          data: {
            video: this.formData.video.id,
            cover: this.formData.cover.id,
            songLink: this.formData.songLink,
            description: this.formData.description
          },
          msg: {
            start: 'Saving',
            error: 'Can\'t save the post',
            success: 'Post created'
          }
        });
        
        console.log(result);
      }
    },

    components: {
      VUpload
    }
  };
</script>
