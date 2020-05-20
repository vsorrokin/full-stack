<template lang="jade">
  .btn.upload-area(@click="cancel")
    label 
      i.icon-upload(v-if="!file")
      span.text {{label}}
    
    .label-copy-wrap(:style="{width: `${progress}%`}")
      label(:style="{width}")
        i.icon-upload(v-if="!file")
        span.text {{label}}
    
    input(type="file" @change="onFile" ref="file")

</template>

<script>

export default {
  name: 'upload',
  
  props: {
    settings: {
      type: Object,
      default() {
        return {};
      }
    },
    value: {
      type: [Object, String],
      default() {
        return {}
      }
    },
  },
  
  watch: {
    value(val) {
      if (val === null) {
        this.reset();
      }
    }
  },
  
  data() {
    return {
      request: null,
      file: null,
      width: null,
      progress: 0
    }
  },
  
  mounted() {
    this.width = this.$refs.file.offsetWidth + 'px';
  },
  
  computed: {
    label() {
      if (this.file && this.request) {
        return `Uploading ${this.file.name} (${this.file.size} MB). Click to cancel.`;
      }
      
      if (this.file && !this.request) {
        return `${this.file.name} (${this.file.size} MB)`;
      }
      
      return this.settings.label || 'Select file';
    }
  },

  methods: {
    updateModel(val) {
      this.$emit('input', val);
    },
    
    reset() {
      this.request = null;
      this.file = null;
      this.progress = 0;
    },
    
    cancel(event) {
      if (this.request) {
        this.updateModel(null);
        event.preventDefault();
        this.request.cancel('Aborted by user');
      }
    },
    
    async upload(file) {
      this.updateModel('uploading');
      
      this.file = {
        name: file.name,
        type: file.type,
        size: (file.size / 1024 / 1024).toFixed(2)
      };

      this.request = this.$networkAction.upload({
        scope: this,
        type: this.settings.type,
        file,
        onUploadProgress: (progressEvent) => {
          this.progress = (progressEvent.loaded / progressEvent.total) * 100;
        }
      })
      
      let result;
      try {
        result = await this.request.promise;
      } catch (e) {
        console.error(e);
      }
      
      if(result) {
        this.updateModel(result.data.upload);
        this.request = null;
      }
    },
    
    onFile(event) {
      const file = event.target.files[0];
      event.target.value = null;
      
      const maxFileSize = GCONFIG.maxFileSize[this.settings.type];
      if (file. size / 1024 / 1024 > maxFileSize) {
        this.$notification.error(`Max file size is ${maxFileSize}MB`);
        return;
      }

      this.upload(file);
    }
  }
};
</script>
