<template>
  <div class="record-area">
    <!-- <div v-if="audioUrl">
      <audio-player :url="audioUrl"/>
      <el-tooltip popper-class="no-border" placement="bottom-start" width="258" :value="true" effect="light" :manual="true">
        <div slot="content" style="width: 258px">
          <p class="record-tip-text">放弃或提交录制完成的音频？</p>
          <div class="record-button-group">
            <div class="cancel" @click="cancel">放弃</div>
            <div class="cancel primary" @click="sendRecord">提交</div>
          </div>
        </div>
        <div class="tips-area"></div>
      </el-tooltip>
    </div> -->
    <div v-if="!isAniInFixed" class="float-line audio-line animation-line">
      <div class="audio-play"></div>
      <div class="audio-play"></div>
      <div class="audio-play"></div>
      <div class="audio-play"></div>
      <div class="audio-play"></div>
    </div>
    <div v-show="!endRecording">
      <div class="fixed-area" v-if="!audioUrl">
        <audio id="record-audio" width="1" height="1" src="opacity: 0"/>
        <div v-if="isAniInFixed" class="audio-line animation-line">
          <div class="audio-play"></div>
          <div class="audio-play"></div>
          <div class="audio-play"></div>
          <div class="audio-play"></div>
          <div class="audio-play"></div>
        </div>
        <div class="record-footer">
          <i class="done" @click="done"></i>
          <p v-if="!endRecording" class="record-time">{{getTime(timeValue)}} / 02:00</p>
        </div>
      </div>
    </div>
    <common-progress :progress="progress" :cancel="cancelUp"/>
  </div>
</template>
<script>
import {startRecordAudio, saveRecordAudio, endRecordAudio, cancelUpAudio} from '@/utils/audio'
import audioPlayer from './audioPlayer.vue'
import CommonProgress from './commonProgress.vue'
export default {
  components: { audioPlayer, CommonProgress },
  props: {
    onSend: {
      type: Function,
      default: () => null
    },
    cancel: {
      type: Function,
      default: () => null
    },
    onRecordDone: {
      type: Function,
      default: () => null
    },
    autoDone: {
      type: Boolean,
      default: false // 自动完成提交，不要二次确认
    },
    isAniInFixed: {
      type: Boolean,
      default: true
    },
  },
  data() {
    return {
      endRecording: false,
      timeValue: 0,
      color: '#999',
      maxTime: 120, // 秒
      audioUrl: '',
      visible: false,
      progress: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.startRecord()
    })
  },
  beforeDestroy() {
    this.clearCount()
    if(!this.endRecording) {
      endRecordAudio()
    }
  },
  methods: {
    count() {
      this.timer = setInterval(() => {
        if(this.timeValue >= this.maxTime) {
          this.done()
        } else {
          this.timeValue ++
          this.color = this.timeValue % 2 === 1 ? '#999' : 'red'
        }
        
      }, 1000)
    },
    clearCount() {
      if(this.timer) clearInterval(this.timer)
      this.color = '#999'
    },
    getTime(value) {
      // if(value < 60) {
      //   return `00:00:${value}`
      // }
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor((value - hours * 3600) / 60)
      const seconds = value - hours * 3600 - minutes * 60
      return `${('0' + minutes).substr(-2)}:${('0' + seconds).substr(-2)}`
    },
    done() {
      if(!this.endRecording) {
        this.onRecordDone()
        this.endRecording = true
        saveRecordAudio(this.onProgressUpLoad).then((url) => {
          if(url) {
            if(this.autoDone) {
              this.onSend(url)
            } else {
              // 发送url信息
              this.audioUrl = url
              this.sendRecord()
            }
          }
        })
        this.clearCount()
      }
    },
    onProgressUpLoad(progress) {
      this.progress = progress
    },
    startRecord() {
      this.timeValue = 0
      startRecordAudio(document.getElementById("record-audio"), () => {
        this.endRecording = false
        this.count()
      }, () => {
        this.cancelUp()
      })
    },
    sendRecord(){
       this.onSend(this.audioUrl, 'audio')
    },
    cancelUp() {
      cancelUpAudio()
      this.onProgressUpLoad(0)
      this.cancel()
    }
  }

}
</script>

<style scoped>
.record-area{
  height: 60px;
  width: 100%;
  position: relative;
}
.tips-area{
  width: 5px;
  height: 5px;
  background: transparent;
  display: inline-block;
  float: left;
  margin-left: 10px;
  margin-top: 5px;
}
.record-button-group{
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.record-tip-text{
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #474747;
}
.cancel{
  width: 60px;
  height: 24px;
  background: #D0D2DF;
  opacity: 1;
  border-radius: 25px;
  font-size: 12px;
  font-family: FZCuYuan-M03S;
  font-weight: 400;
  line-height: 24px;
  color: #FFFFFF;
  cursor: pointer;
  text-align: center;
}
.cancel:hover{
  background-color: rgba(21, 195, 154, 1);
}
.cancel.primary{
  /* background-color: rgba(21, 195, 154, 1); */
  margin-left: 12px;
}
.fixed-area{
  height: 60px;
  width: 280px;
  position: fixed;
  top: 5px ;
  right: 35px
}
.record-footer{
  height: 30px;
  box-sizing: border-box;
  background-color: rgba(43,51,63,0.7);
  width: 100%;
  padding-left: 10px;
  display: flex;
  align-items: center;
}
.done{
  width: 24px;
  height: 24px;
  cursor: pointer;
  background-color: red;
  margin-right: 20px;
}
.record-time{
  font-size: 10px;
  color: #fff;
}

.float-line{
  margin-top: 15px;
}
</style>