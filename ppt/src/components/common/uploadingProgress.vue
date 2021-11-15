<template>
  <div class="temp-container">
    <slot />
    <div class="fileName" v-if="item.file && item.file.name">{{item.file.name}}</div>
    <div class="progress">
      <span :style="`width: ${progress}%;`"><span>{{progress}}%</span></span>
    </div>
  </div>
</template>
<script>
import {upFireBaseFile} from '@/utils/uploadFile'
export default {
  data() {
    return {
      progress: 0,
      uploader: null,
      fileName: ''
    }
  },
  props: {
    onSuccess: {
      type: Function,
      default: () => null
    },
    item: {
      type: Object,
      default: () => null
    }
  },
  created() {
    if(this.item.file) {
      this.onUpload()
    }
  },
  beforeDestroy() {
    this.cancel()
  },
  methods: {
    onUpload() {
      this.uploader = upFireBaseFile(
        this.item.file,
        this.onProgressUpLoad,
        ((result) => {
          this.onSuccess(this.item, result)
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
    },
  }
}
</script>
<style scoped>
.temp-container{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.progress {
  height: 90px;
  background: #ebebeb;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
}
.progress > span {
  position: relative;
  float: left;
  margin: 0 -1px;
  min-width: 40px;
  line-height: 90px;
  text-align: right;
  border: 1px solid;
  /* border-radius: 10px; */
  background: rgba(21, 195, 154, 0.7);
  border-color: rgba(21, 195, 154, 0.7);
  height: 90px;
}
.progress > span > span {
  padding: 0;
  font-size: 1px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px rgba(255, 255, 255, 0.4);
}
.fileName{
  opacity: 0.3;
  width: 100%;
  min-height: 90px;
  position: absolute;
  top: 40px;
  left: 0;
  text-align: center;
  color: #333;
  font-size: 20px;
  word-break: break-word;
  display: flex;
  align-items: center;
  line-height: 30px;
}
</style>