<template>
  <div class="remark-item-content-right">
    <VideoPlayer
      v-if="item.content && item.content.mediaType === 'video'"
      controlslist="nodownload"
      controls
      :src="item.content.link"
      width="280"
      height="150"
      preload="auto"
      style="height: 150px"
    />
    <audio-player
      v-else-if="item.content &&  item.content.mediaType === 'audio'"
      :url="item.content.link"
    />
    <div class="remark-file-right" v-else-if="item.content.mediaType === 'file'">
      <file-answer-icon :item="item" />
      <div style="flex: 1">
        <p class="file-name-right">{{item.content.fileName}}</p>
        <a :href="item.content.link" download target="_blank"  class="download-text">Download</a>
      </div>
    </div>
    <div class="remark-img" v-else-if="item.content.mediaType === 'image'">
      <base64image :url="item.content.link" :showPreview="true"/>
    </div>
  </div>
</template>
<script>
import audioPlayer from '@/components/common/audioPlayer.vue';
import base64image from '@/components/base64image.vue';
import FileAnswerIcon from '@/components/common/fileAnswerIcon.vue';
export default {
  components: { audioPlayer, base64image, FileAnswerIcon },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>