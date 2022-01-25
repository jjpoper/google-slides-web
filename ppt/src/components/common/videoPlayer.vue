<template>
  <video
    controlslist="nodownload"
    controls=""
    :src="src"
    preload="auto"
    ref="videoPlayer"
  />
</template>
<script>
export default {
  name: 'VideoPlayer',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  mounted() {
    this.$refs.videoPlayer.volume = 0
  },
  beforeDestroy() {
    if(document.pictureInPictureElement) {
      try {
        document.exitPictureInPicture()
      } catch(e) {}
    }
    
  }
}
</script>