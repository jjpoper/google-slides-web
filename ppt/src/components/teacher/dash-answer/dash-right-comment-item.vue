<template>
  <div class="remark-item-content">
    <VideoPlayer
      v-if="item.type === 'video'"
      controlslist="nodownload"
      controls
      :src="item.link"
      width="280"
      height="150"
      preload="auto"
    />
    <audio-player
      v-else-if="item.type === 'audio'"
      :url="item.link"
    />
    <div class="remark-file" v-else>
      <p class="file-name">{{item.link}}</p>
    </div>
  </div>
</template>
<script>
import audioPlayer from '@/components/common/audioPlayer.vue';
export default {
  components: { audioPlayer },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getIconClass(name) {
      if (!name) return "file";
      name = name.toLocaleLowerCase();
      if (name.indexOf(".pdf") > -1) return "pdf";
      if (name.indexOf(".doc") > -1) return "word";
      return "file";
    }
  }
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>