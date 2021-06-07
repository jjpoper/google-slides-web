<template>
  <div>
    <div class="audio-list">
      <svg t="1623073048132" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3817" width="32" height="32"><path d="M526.336 644.096c123.904 0 223.744-97.28 223.744-221.184V238.08c0-123.904-99.84-221.184-223.744-221.184s-223.744 97.28-223.744 221.184v184.832c0 123.904 97.28 221.184 223.744 221.184z m350.208-267.264c0-22.016-19.456-41.472-44.032-41.472s-41.472 19.456-41.472 41.472c0 4.608 0 9.728 2.56 12.288v31.744c0 143.36-119.296 262.656-267.776 262.656-145.92 0-267.776-119.296-267.776-262.656V384c0-2.56 2.56-4.608 2.56-9.728 0-22.016-19.456-41.472-41.472-41.472-24.576 0-41.472 19.456-41.472 41.472V435.2c0 177.664 133.632 318.464 304.128 343.04v82.944H365.568c-24.576 0-44.032 19.456-44.032 44.032s19.456 41.472 44.032 41.472h316.416c26.624 0 41.472-16.896 41.472-41.472 0-22.016-16.896-44.032-41.472-44.032h-116.736V778.24c175.104-19.456 311.296-165.376 311.296-343.04V376.832z" p-id="3818"
      :fill="color"></path></svg>
      <p>{{getTime(timeValue)}}</p>
      <audio id="record-audio"  width="1" height="1" src="opacity: 0"/>
    </div>
    <el-row>
      <el-tooltip content="start" placement="top" v-if="endRecording">
        <el-button type="primary" icon="el-icon-video-play" @click="startRecord" circle></el-button>
      </el-tooltip>
      <!-- <el-tooltip content="resume" placement="top" v-if="!isRecording && !endRecording">
        <el-button type="primary" icon="el-icon-video-play" @click="resume" circle></el-button>
      </el-tooltip>
      <el-tooltip content="pause" placement="top" v-else-if="isRecording && !endRecording">
        <el-button type="primary" icon="el-icon-video-pause" @click="pause" circle></el-button>
      </el-tooltip> -->
      <el-button v-if="!endRecording" type="primary" @click="done">done</el-button>
    </el-row>
  </div>
</template>
<style scoped>
.audio-list{
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 50px;
  /* padding: 10px 0; */
  align-items: center;
  border: 1px solid #999;
  margin-bottom: 5px;
}
</style>
<script>
import {startRecordAudio, pauseRecordAudio, resumeRecordAudio, saveRecordAudio} from '@/utils/audio'
export default {
  props: {
    onSend: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      endRecording: false,
      timeValue: 0,
      color: '#999'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.startRecord()
    })
  },
  beforeDestroy() {
    this.clearCount()
  },
  methods: {
    count() {
      this.timer = setInterval(() => {
        this.timeValue ++
        this.color = this.timeValue % 2 === 1 ? '#999' : 'red'
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
      return `${('0' + hours).substr(-2)} : ${('0' + minutes).substr(-2)} : ${('0' + seconds).substr(-2)}`
    },
    done() {
      if(!this.endRecording) {
        this.endRecording = true
        saveRecordAudio().then((d) => {
          if(d.data) {
            // 发送url信息
            this.onSend(d.data, 'audio')
          }
        })
        this.clearCount()
      }
    },
    startRecord() {
      this.timeValue = 0
      startRecordAudio(document.getElementById("record-audio"))
      this.endRecording = false
      this.count()
    },
  }

}
</script>