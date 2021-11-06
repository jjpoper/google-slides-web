<template>
  <div class="full">
    <iframe
      class="full"
      :width="rect.width"
      :height="rect.height"
      :src="getIframe(rect.url)" 
      title="YouTube video player"
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
    <div class="playmask">
      <div class="playButton"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    rect: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getIframe(url){
      const formatId = url.split('?v=')[1]
      if(formatId) {
        return `https://www.youtube.com/embed/${formatId}`
      }
      return url
    },
  }
  
}
</script>
<style scoped>
.full{
  width: 100%;
  height: 100%;
  position: relative;
  line-height: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  border: none !important;
}
.playmask{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.7);
}
.playButton{
  width: 50px;
  height: 50px;
  background-image: url(../../assets/picture/youtubeplay.png);
  background-repeat: no-repeat;
  background-size: 50px 50px;
  cursor: pointer;
  margin-right: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-25px, -25px);
}
</style>