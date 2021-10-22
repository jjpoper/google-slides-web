<template>
  <div class="upload-file">
    <input
      class="upload-file"
      type="file"
      :accept="accept"
      @change="onUpload"/>
      <common-progress :progress="progress"/>
  </div>
</template>
<script>
import {upFireBaseFile} from '@/utils/uploadFile'
import commonProgress from './commonProgress.vue'
export default {
  components: { commonProgress },
  data() {
    return {
      progress: 0
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
      upFireBaseFile(file, this.onProgressUpLoad).then((result) => {
        this.onSuccess(file, result)
        setTimeout(() => {
          this.progress = 0
        }, 50);
      })
    },
    onProgressUpLoad(progress) {
      this.progress = progress
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