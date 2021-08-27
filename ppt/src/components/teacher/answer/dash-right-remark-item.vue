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
      <div>
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
.remark-item-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding: 15px;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: center;
}
.remark-file {
  height: 60px;
  display: flex;
  align-items: center;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.file-icon {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.file-icon.pdf {
  background-image: url(../../../assets/picture/pdf.png);
}
.file-icon.word {
  background-image: url(../../../assets/picture/word.png);
}
.file-icon.file {
  background-image: url(../../../assets/picture/file.png);
}
.download-text {
  text-decoration: none;
  text-align: left;
  float: left;
  padding-right: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right;
  background-image: url(../../../assets/picture/download.png);
  background-size: 12px 11px;
  cursor: pointer;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15c39a;
}
.file-name {
  font-size: 10px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
}
</style>