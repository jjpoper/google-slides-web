<template>
  <!-- 这里设置了ref属性后，在vue组件中，就可以用this.$refs.audio来访问该dom元素 -->
  <!-- <div class="di main-wrap" v-if="url">
    <audio ref="audio"
      class="dn" 
      :src="url"
      preload="auto"
      @play="onPlay" 
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause" 
      @timeupdate="onTimeupdate" 
      @canplay="audioCanplay"
      @loadedmetadata="loadedmetadata"
      ></audio>
    <div>
      <el-slider
        v-show="!controlList.noProcess"
        v-model="sliderTime"
        :format-tooltip="formatProcessToolTip"
        class="audio-slider"
        @change="changeCurrentTime" >
      </el-slider>
      <div class="class-audio-control" v-if="audio.maxTime !== 0">
        <button @click="startPlayOrPause" :class="`audio-button audio-button-${audio.playing ? 'pause' : 'play'}`"></button>
        <span class="audio-time">{{audio.currentTime | formatSecond}}</span>
        /
        <span class="audio-time">{{ audio.maxTime | formatSecond}}</span>
      </div>
    </div>
  </div> -->
  <div class="di main-wrap" v-if="url">
    <audio ref="audio"
      class="dn" 
      :src="url"
      preload="auto"
      @play="onPlay" 
      @error="onError"
      @waiting="onWaiting"
      @pause="onPause" 
      @timeupdate="onTimeupdate" 
      @canplay="audioCanplay"
      @loadedmetadata="loadedmetadata"
    />
    <div>
      <div :class="`audio-line animation-line ${audio.playing ? '' : 'paused'}`">
        <div class="audio-play"></div>
        <div class="audio-play"></div>
        <div class="audio-play"></div>
        <div class="audio-play"></div>
        <div class="audio-play"></div>
      </div>
      <div class="play-button">
        <div class="class-audio-control" v-if="audio.maxTime !== 0">
        <button @click="startPlayOrPause" :class="`audio-button audio-button-${audio.playing ? 'pause' : 'play'}`"></button>
        <span class="audio-time">{{audio.currentTime | formatSecond}}</span>
        /
        <span class="audio-time">{{ audio.maxTime | formatSecond}}</span>
      </div>
      </div>
    </div>
    <div class="transformmask maskPlay" @click="startPlayOrPause" v-if="withMaskButton && !audio.playing ">
      <svg height="80%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="rgba(0,0,0,0.6)"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>
    </div>
  </div>
</template>

<script>
  function realFormatSecond(second) {
    var secondType = typeof second
    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second)
      // var hours = Math.floor(second / 3600)
      // second = second - hours * 3600
      var mimute = Math.floor(second / 60)
      second = second - mimute * 60
      return ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
      return '00'
    }
  }
  export default {
    props: {
      url: {
        type: String,
        required: true,
      },
      withMaskButton: {
        type: Boolean,
        default: false,
      }
    },
    name: 'VueAudio',
    data() {
      return {
        audio: {
          currentTime: 0,
          maxTime: 0,
          playing: false,
          muted: false,
          speed: 1,
          waiting: true,
          preload: 'preload'
        },
        sliderTime: 0,
        volume: 100,
        speeds: this.theSpeeds,
        controlList: {
          // 不显示下载
          noDownload: false,
          // 不显示静音
          noMuted: false,
          // 不显示音量条
          noVolume: false,
          // 不显示进度条
          noProcess: false,
          // 只能播放一个
          onlyOnePlaying: true,
          // 不要快进按钮
          noSpeed: false
        }
      }
    },
    methods: {
      checkRefsInstance() {
        return this.$refs.audio
      },
      // 进度条toolTip
      formatProcessToolTip(index = 0) {
        index = parseInt(this.audio.maxTime / 100 * index)
        return 'time: ' + realFormatSecond(index)
      },
      // seek
      changeCurrentTime(index) {
        if(!this.checkRefsInstance()) return
        this.$refs.audio.currentTime = parseInt(index / 100 * this.audio.maxTime)
      },
      startPlayOrPause() {
        return this.audio.playing ? this.pausePlay() : this.startPlay()
      },
      // 开始播放
      startPlay() {
        if(!this.checkRefsInstance()) return
        this.$refs.audio.play()
      },
      // 暂停
      pausePlay() {
        if(!this.checkRefsInstance()) return
        this.$refs.audio.pause()
      },
      // 当音频暂停
      onPause () {
        this.audio.playing = false
      },
      // 当发生错误, 就出现loading状态
      onError () {
        this.audio.waiting = true
      },
      // 当音频开始等待
      onWaiting (res) {
        // console.log(res)
      },
      // 当音频开始播放
      onPlay (res) {
        // console.log(res)
        this.audio.playing = true
        this.audio.loading = false
        if(!this.controlList.onlyOnePlaying){
          return 
        }
        let target = res.target
        let audios = document.getElementsByTagName('audio');
        [...audios].forEach((item) => {
          if(item !== target){
            item.pause()
          }
        })
      },
      // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
      onTimeupdate(res) {
        // // console.log('timeupdate')
        // // console.log(res.target.currentTime)
        this.audio.currentTime = res.target.currentTime
        this.sliderTime = parseInt(this.audio.currentTime / this.audio.maxTime * 100)
      },
      // 当加载语音流元数据完成后，会触发该事件的回调函数
      // 语音元数据主要是语音的长度之类的数据
      loadedmetadata(res) {
        // // console.log('loadedmetadata', res.target.duration)
        // this.audio.waiting = false
        // this.audio.maxTime = parseInt(res.target.duration)
      },
      async audioCanplay(e) {
        if(this.audio.maxTime === 0) {
          const firsthandAudio = e.target;
          while (firsthandAudio.duration === Infinity && this.audio.maxTime === 0 && this.checkRefsInstance()) {
            await new Promise(r => setTimeout(r, 200));
            firsthandAudio.currentTime = 10000000 * Math.random();
          }
          this.audio.waiting = false
          if(this.$refs.audio) this.$refs.audio.currentTime = 0
          this.audio.maxTime  = firsthandAudio.duration;
          // console.log('done', this.audio.maxTime)
        }
      },
    },
    filters: {
      formatSecond(second = 0) {
        return realFormatSecond(second)
      },
      transPlayPause(value) {
        return value ? '暂停' : '播放'
      },
      transMutedOrNot(value) {
        return value ? '放音' : '静音'
      },
      transSpeed(value) {
        return '快进: x' + value
      }
    },
    created() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .main-wrap{
    width: 100%;
  }
  .audio-slider {
    padding: 0 10px;
  }
  .di {
    display: inline-block;
  }
  .download {
    color: #409EFF;
    margin-left: 15px;
  }
  .dn{
    display: none;
  }
  .el-slider__runway{
    background-color: rgba(21, 195, 154, 0.5) !important;
  }
  .el-slider__bar{
    background-color: rgba(21, 195, 154, 0.5) !important;
  }
  .el-slider__button{
    border: 2px solid rgba(21, 195, 154, 1) !important;
    background-color: rgba(21, 195, 154, 1) !important;
  }
  .class-audio-control{
    margin-top: 5px;
    height: 20px;
    /* background: rgba(0, 0, 0, 0.5); */
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 0 11px;
    font-size: 10px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: #FFFFFF;
    float: left;
    line-height: 20px;
  }
  .audio-button{
    padding: 0;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-right: 10px;
  }
  .audio-button-play{
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-left: 8px solid #fff;
    border-bottom: 6px solid transparent;
  }
  .audio-button-pause{
    width: 8px;
    height: 8px;
    background: #fff;
  }
  .audio-time{
    margin: 0 5px;
  }
  /* 新的样式 */
  .play-button{
    width: 100%;
    height: 30px;
    background-color: rgba(43,51,63,.7);
  }
  .maskPlay{
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>