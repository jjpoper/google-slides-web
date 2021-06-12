<template>
  <div>
    <video id="record-video" width="200" height="150"/>
    <p style="text-align: center">{{getTime(timeValue)}} / 00 : 02 : 00</p>
    <el-row justify="center" type="flex">
      <el-tooltip content="start" placement="top" v-if="endRecording">
        <el-button type="primary" icon="el-icon-video-play" @click="startRecord" circle></el-button>
      </el-tooltip>
      <!-- <el-tooltip content="resume" placement="top" v-if="!isRecording && !endRecording">
        <el-button type="primary" icon="el-icon-video-play" @click="resumeVideo" circle></el-button>
      </el-tooltip>
      <el-tooltip content="pause" placement="top" v-else-if="isRecording && !endRecording">
        <el-button type="primary" icon="el-icon-video-pause" @click="pauseVideo" circle></el-button>
      </el-tooltip> -->
      <el-button v-if="!endRecording" type="primary" @click="doneRecord">done</el-button>
    </el-row>
  </div> 
</template>
<script>
import {startRecordVideo, pauseRecordVideo, resumeRecordVideo, saveRecordVideo, endRecord} from '@/utils/video'
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
      maxTime: 120 // 秒
    }
  },
  mounted() {
    this.startRecord()
  },
  beforeDestroy() {
    if(!this.endRecording) {
      endRecord()
    }
  },
  methods: {
    pauseVideo() {
      pauseRecordVideo()
      this.isRecording = false
    },
    resumeVideo() {
      resumeRecordVideo()
      this.isRecording = true
    },
    count() {
      this.timer = setInterval(() => {
        if(this.timeValue >= this.maxTime) {
          this.doneRecord()
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
      return `${('0' + hours).substr(-2)} : ${('0' + minutes).substr(-2)} : ${('0' + seconds).substr(-2)}`
    },
    doneRecord() {
      if(!this.endRecording) {
        this.endRecording = true
        this.isRecording = false
        saveRecordVideo().then((d) => {
          if(d.data) {
            // 发送url信息
            this.onSend(d.data, 'video')
          }
        })
        this.clearCount()
      }
    },
    startRecord() {
      startRecordVideo(document.getElementById("record-video"))
      this.isRecording = true
      this.endRecording = false
      this.timeValue = 0
      this.count()
    },
  }
}
</script>