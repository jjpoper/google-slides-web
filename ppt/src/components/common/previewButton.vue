<template>
  <div class="previewBtn" @click="showPreview">
  </div>
</template>
<script>
import {mapActions} from 'vuex'
export default {
  props: {
    url: {
      type: String,
      default: ''
    },
    previewPress: {
      type: Function,
      default: () => null
    }
  },
  methods: {
    ...mapActions("teacher", ["setCurrentPreviewData"]),
    showPreview() {
      this.setCurrentPreviewData({
        type: 'image',
        url: this.url
      })
    }
  }
}
</script>
<style scoped>
.previewBtn{
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 50px;
  height: 50px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 50px 50px;
  background-image: url(../../assets/picture/previewBig.png);
  cursor: pointer;
}
</style>