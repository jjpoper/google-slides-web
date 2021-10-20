<template>
  <div class="upload-outer">
    <img src="../../assets/picture/add.png" class="upload-button" />
    <input
      class="upload-file"
      type="file" accept=".doc, .docx, .pdf, application/pdf,audio/*,video/*,image/*"
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
    }
  },
  methods: {
    onUpload(e) {
      const file = e.target.files[0]
      console.log(file)
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
.upload-outer{
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  padding: 10px;
  cursor: pointer;
  position: relative;
}
.upload-button{
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.upload-file{
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  opacity: 0;
}
</style>