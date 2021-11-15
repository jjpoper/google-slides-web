<template>
  <div class="remark-item-content">
    <video
      v-if="item.content && item.content.mediaType === 'video'"
      controlslist="nodownload"
      controls
      :src="item.content.link"
      width="280"
      height="150"
      preload="none"
    />
    <audio-player
      v-else-if="item.content &&  item.content.mediaType === 'audio'"
      :url="item.content.link"
    />
    <div class="remark-file" v-else-if="item.content.mediaType === 'file'">
      <div :class="`file-icon ${getIconClass(item.content.fileName)}`"></div>
      <div style="flex: 1">
        <p class="file-name">{{item.content.fileName}}</p>
        <a :href="item.content.link" download class="download-text">Download</a>
      </div>
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