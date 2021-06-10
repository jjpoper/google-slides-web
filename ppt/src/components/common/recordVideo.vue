<template>
  <div>
    <video id="record-video" width="200" height="150"/>
    <el-row justify="center">
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
      }
    },
    startRecord() {
      startRecordVideo(document.getElementById("record-video"))
      this.isRecording = true
      this.endRecording = false
    },
  }
}
</script>