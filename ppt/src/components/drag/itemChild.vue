<template>
  <div class="full">
    <div v-if="item.type === 'image'" class="meidaitem teacherppt full" >
      <img :src="item.url" class="full"/>
    </div>
    <div v-if="item.type === 'video'" class="meidaitem teacherppt full" >
      <VideoPlayer :src="item.url" class="full"
        controlslist="nodownload"
        controls/>
    </div>
    <div v-if="item.type === 'audio'" class="meidaitem teacherppt full" >
      <audio-player :url="item.url" class="full" :withMaskButton="true"/>
    </div>
    <div v-if="item.type === 'iframe'" class="meidaitem teacherppt full" >
      <youtube :rect="item"/>
    </div>
  </div> 
</template>
<script>
import AudioPlayer from '../common/audioPlayer.vue';
import Youtube from './youtube.vue';
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    AudioPlayer,
    Youtube,
  },
}
</script>
<style scoped>
.full{
  width: 100%;
  height: 100%;
  position: relative;
  line-height: 0;
  overflow: hidden;
}
</style>