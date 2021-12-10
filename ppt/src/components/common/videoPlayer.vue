<template>
  <video
    controlslist="nodownload"
    controls=""
    :src="src"
    preload="auto"
    disablePictureInPicture
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
  beforeDestroy() {
    if(document.pictureInPictureElement) {
      try {
        document.exitPictureInPicture()
      } catch(e) {}
    }
    
  }
}
</script>