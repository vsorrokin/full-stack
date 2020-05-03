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
  
  import gql from 'graphql-tag';

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
            
        // We save the user input in case of an error
        const newTag = this.newTag
        // We clear it early to give the UI a snappy feel
        this.newTag = ''
        // Call to the graphql mutation
        this.$apollo.mutate({
          // Query
          mutation: gql`mutation ($video_id: Int!, $cover_id: Int!, $song_link: String, $description: String) {
            createPost(video_id: $video_id, cover_id: $cover_id, song_link: $song_link, description: $description) {
              video_id,
              cover_id,
              song_link,
              description
            }
          }`,
          
          // Parameters
          variables: {
            video_id: this.formData.video.id,
            cover_id: this.formData.cover.id,
            song_link: this.formData.songLink,
            description: this.formData.description
          },
          
          // Update the cache with the result
          // The query will be updated with the optimistic response
          // and then with the real result of the mutation
          // update: (store, { data: { addTag } }) => {
          //   // Read the data from our cache for this query.
          //   const data = store.readQuery({ query: TAGS_QUERY })
          //   // Add our tag from the mutation to the end
          //   data.tags.push(addTag)
          //   // Write our data back to the cache.
          //   store.writeQuery({ query: TAGS_QUERY, data })
          // },
          // // Optimistic UI
          // // Will be treated as a 'fake' result as soon as the request is made
          // // so that the UI can react quickly and the user be happy
          // optimisticResponse: {
          //   __typename: 'Mutation',
          //   addTag: {
          //     __typename: 'Tag',
          //     id: -1,
          //     label: newTag,
          //   },
          // },
        }).then((data) => {
          // Result
          console.log(data)
        }).catch((error) => {
          // Error
          console.error(error)
        })
        
        // const result = await this.$helpers.run({
        //   scope: this,
        //   endpoint: 'post/',
        //   data: {
        //     video_id: this.formData.video.id,
        //     cover_id: this.formData.cover.id,
        //     song_link: this.formData.songLink,
        //     description: this.formData.description
        //   },
        //   msg: {
        //     start: 'Saving',
        //     error: 'Can\'t save the post',
        //     success: 'Post created'
        //   }
        // });
        
        //console.log(result);
      }
    },

    components: {
      VUpload
    }
  };
</script>
