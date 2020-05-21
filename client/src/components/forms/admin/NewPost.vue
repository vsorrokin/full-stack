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
  
  let originalFormData = null;

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
    
    created() {
      originalFormData = {...this.formData};
    },
    
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
      resetForm() {
        this.formData = {...originalFormData};
        this.$v.$reset();
      },
      
      async onSubmitValidationSuccess() {
        
        const result = await this.$graphqlRequest.run({
          scope: this,
          mutation: 'createPost',
          data: {
            video_id: ['Int!', +this.formData.video.id],
            cover_id: ['Int!', +this.formData.cover.id],
            song_link: ['String', this.formData.songLink],
            description: ['String', this.formData.description]
          },
          returnProps: ['id'],
          msg: {
            start: 'Saving',
            error: 'Can\'t save the post',
            success: 'Post created'
          }
        });
        
        if (result.id) {
          this.resetForm();
        }

      }
    },

    components: {
      VUpload
    }
  };
</script>
