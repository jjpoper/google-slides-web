<template>
  <div class="upload-file">
    <input
      class="upload-file"
      type="file"
      :accept="accept"
      @change="onUpload"/>
      <el-dialog
        v-if="progress > 0"
        :title="`uploading ${progress}%`"
        visible
        :append-to-body="true"
        :show-close="false"
      >
      </el-dialog>
  </div>
</template>
<script>
import {upFireBaseFile} from '@/utils/uploadFile'
export default {
  data() {
    return {
      progress: 0,
      showProgress: false
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
      this.progress = 0
      upFireBaseFile(file, this.onProgressUpLoad).then((result) => {
        this.progress = 0
        this.onSuccess(file, result)
      })
    },
    onProgressUpLoad(progress) {
      this.progress = parseInt(progress)
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