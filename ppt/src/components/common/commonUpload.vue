<template>
  <div class="upload-file">
    <input
      class="upload-file"
      type="file"
      :accept="accept"
      @change="onUpload"/>
      <el-dialog
        v-if="progress > 0"
        title="uploading"
        visible
        :append-to-body="true"
        :show-close="false"
      >
        <div class="progress">
          <span :style="`width: ${progress}%;`"><span>{{progress}}%</span></span>
        </div>
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
        this.progress = 100
        this.onSuccess(file, result)
        setTimeout(() => {
          this.progress = 0
        }, 100);
      })
    },
    onProgressUpLoad(progress) {
      this.progress = Math.min(parseInt(progress), 99)
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
.progress {
  height: 20px;
  background: #ebebeb;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 10px;
}
.progress > span {
  position: relative;
  float: left;
  margin: 0 -1px;
  min-width: 30px;
  height: 18px;
  line-height: 16px;
  text-align: right;
  border: 1px solid;
  border-radius: 10px;
  background: #85c440;
  border-color: #78b337 #6ba031 #568128;
  background-image: -webkit-linear-gradient(top, #b7dc8e 0%, #99ce5f 70%, #85c440 100%);
  background-image: -moz-linear-gradient(top, #b7dc8e 0%, #99ce5f 70%, #85c440 100%);
  background-image: -o-linear-gradient(top, #b7dc8e 0%, #99ce5f 70%, #85c440 100%);
  background-image: linear-gradient(to bottom, #b7dc8e 0%, #99ce5f 70%, #85c440 100%);
  -webkit-box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2);
}
.progress .green {
 
}
.progress > span > span {
  padding: 0 8px;
  font-size: 11px;
  font-weight: bold;
  color: #404040;
  color: rgba(0, 0, 0, 0.7);
  text-shadow: 0 1px rgba(255, 255, 255, 0.4);
}
</style>