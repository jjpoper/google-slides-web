<template>
  <div class="audio_page">
    <recordAudio v-if="startRecord" :onSend="sendVideoOrAudio" />
    <audio
      v-else-if="sendSuccess&&link"
      controlslist="nodownload"
      controls
      :src="link"
      style="width:100%;"
    />
    <p @click="startAudio()">Recoid an audio</p>
  </div>
</template>

<style scoped>
.audio_page {
  width: 100%;
  height: 80px;
  padding: 10px;
}
p {
  cursor: pointer;
}
</style>

<script>
import recordAudio from "../common/recordAudio.vue";
export default {
  components: { recordAudio },
  props: {
    sendAudioOrVideoAnswer: {
      type: Function
    }
  },
  data() {
    return {
      startRecord: false,
      sendSuccess: false,
      link: ""
    };
  },
  methods: {
    startAudio() {
      this.startRecord = true;
    },
    sendVideoOrAudio(link, type = "") {
      // this.sendComment(url, type)
      this.link = link;
      this.closeRecord();
      this.sendSuccess = true;
      this.sendAudioOrVideoAnswer(link);
    },
    closeRecord() {
      this.startRecord = false;
    }
  }
};
</script>