<template>
  <div class="audio_page">
    <recordAudio v-if="startRecord && type == 'audio'" :onSend="sendVideoOrAudio" />

    <recordVideo v-else-if="startRecord && type == 'video'" :onSend="sendVideoOrAudio" />
    <div v-else-if="link && type == 'audio'" style="width: 90%">
      <audio-player :url="link"/>
    </div>

    <video
      v-else-if="link && type == 'video'"
      controlslist="nodownload"
      controls
      :src="link"
      style="width: 90%"
    />

    <div class="opt_area">
      <div class="opt_btn" @click="startAudio()">Record an audio</div>
      <div class="opt_btn" @click="startVideo()">Record a video</div>
    </div>
  </div>
</template>

<style scoped>
.audio_page {
  width: 100%;
  height: 80px;
  padding: 10px;
  line-height: 40px;
}
.opt_area {
  display: flex;
  justify-content: center;
  flex-direction: row;
  width: 100%;
}
.opt_btn {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: darkcyan;
  border-radius: 5px;
  width: 40%;
  height: 50px;
  color: white;
  margin-left: 20px;
  cursor: pointer;
}
</style>

<script>
import AudioPlayer from '../common/audioPlayer.vue';
import recordAudio from "../common/recordAudio";
import recordVideo from "../common/recordVideo";
export default {
  components: { recordAudio, recordVideo, AudioPlayer },
  props: {
    sendAudioOrVideoAnswer: {
      type: Function
    },
    link: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      startRecord: false,
      sendSuccess: false,
      type: ""
    };
  },

  mounted() {
    
    if (this.link && this.link.indexOf(".mp3") > -1) {
      this.type = "audio";
      console.log(this.link);
    } else if (this.link && this.link.indexOf(".webm") > -1) {
      this.type = "video";
      console.log(this.link);
    }
  },

  methods: {
    startAudio() {
      this.startRecord = true;
      this.type = "audio";
      console.log(this.type);
    },
    startVideo() {
      this.startRecord = true;
      this.type = "video";
      console.log(this.type);
    },
    sendVideoOrAudio(link, type = "") {
      // this.sendComment(url, type)
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