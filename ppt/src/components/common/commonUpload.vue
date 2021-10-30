<template>
  <div>
    <div class="upload-file" >
      <input
        v-if="progress <= 0"
        class="upload-file"
        type="file"
        :accept="accept"
        :value="upValue"
        @change="onUpload"/>
      <div
        v-else
        class="upload-file"
        @click="showUnUpload"/>  
    </div>
    
    <common-progress :progress="progress" :cancel="cancel" :showCancel="true"/>
  </div>
</template>
<script>
import {upFireBaseFile} from '@/utils/uploadFile'
import commonProgress from './commonProgress.vue'
import { showToast } from '@/utils/loading'
export default {
  components: { commonProgress },
  data() {
    return {
      progress: 0,
      upValue: '',
      uploader: null
    }
  },
  props: {
    onSuccess: {
      type: Function,
      default: () => null
    },
    accept: {
      type: String,
      default: '.doc, .docx, .pdf, application/pdf,audio/*,video/*,image/*'
    }
  },
  methods: {
    onUpload(e) {
      const file = e.target.files[0]
      console.log(file)
      // return
      this.uploader = upFireBaseFile(
        file,
        this.onProgressUpLoad,
        ((result) => {
          this.onSuccess(file, result)
          setTimeout(() => {
            this.progress = 0
          }, 50);
        })
      )
    },
    onProgressUpLoad(progress) {
      this.progress = progress
    },
    cancel() {
      if(this.uploader) {
        this.uploader.cancel()
      }
      this.end()
    },
    end() {
      this.progress = 0
      this.upValue = ''
    },
    showUnUpload() {
      showToast('the file is uploading, please wait', 'warning')
    }
  }
}
</script>
<style scoped>
.upload-file{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
</style>