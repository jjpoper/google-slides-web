<template>
  <div class="full">
    <div class="sync" @click="syncSeek">
      <svg t="1636725684472" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2439" width="50" height="50"><path d="M512.881 893.207c-49.82 0.001-98.547-9.233-143.443-27.632-41.295-16.924-77.161-40.7-106.603-70.67-30.839-31.393-53.186-68.148-66.418-109.248a275.173 275.173 0 0 1-5.817-20.855c-4.07-17.197 6.571-34.439 23.769-38.51 17.198-4.067 34.439 6.571 38.51 23.77a210.575 210.575 0 0 0 4.458 15.981c32.548 101.093 136.931 163.071 255.752 163.075 35.771 0.001 72.84-5.615 109.663-17.471 132.818-42.764 224.054-154.224 221.867-271.051-0.331-17.67 13.726-32.262 31.396-32.593 17.666-0.329 32.263 13.725 32.593 31.396 2.711 144.819-106.771 281.823-266.24 333.168-42.779 13.774-86.541 20.638-129.487 20.64z" fill="#15C39A" p-id="2440"></path><path d="M343.863 715.014c-4.905 0-9.88-1.131-14.546-3.518l-136.431-69.784c-15.734-8.048-21.965-27.327-13.917-43.062 8.048-15.735 27.328-21.965 43.062-13.917l136.431 69.784c15.734 8.048 21.965 27.327 13.917 43.062-5.662 11.068-16.883 17.435-28.516 17.435z" fill="#15C39A" p-id="2441"></path><path d="M159.304 791.391c-3.27 0-6.593-0.505-9.872-1.567-16.812-5.448-26.024-23.494-20.576-40.307l47.242-145.779c5.448-16.813 23.494-26.025 40.307-20.576 16.812 5.448 26.024 23.494 20.576 40.307l-47.242 145.779c-4.386 13.532-16.937 22.143-30.435 22.143zM190.328 515.136c-17.395 0-31.655-13.936-31.982-31.402-2.71-144.82 106.771-281.824 266.241-333.168 92.403-29.751 189.333-27.268 272.929 6.993 41.295 16.923 77.161 40.7 106.603 70.669 30.84 31.393 53.187 68.149 66.419 109.249a274.835 274.835 0 0 1 5.817 20.854c4.07 17.198-6.57 34.439-23.769 38.511-17.2 4.069-34.439-6.571-38.511-23.769a210.987 210.987 0 0 0-4.458-15.981c-42.349-131.526-206.271-196.845-365.416-145.605-132.818 42.763-224.053 154.222-221.867 271.05 0.331 17.67-13.725 32.262-31.396 32.593-0.203 0.004-0.407 0.006-0.61 0.006z" fill="#15C39A" p-id="2442"></path><path d="M859.469 441.917c-4.904 0-9.88-1.13-14.546-3.517l-136.432-69.784c-15.734-8.048-21.965-27.327-13.917-43.062 8.048-15.733 27.327-21.966 43.062-13.917l136.432 69.784c15.734 8.048 21.965 27.327 13.917 43.062-5.662 11.068-16.882 17.434-28.516 17.434z" fill="#15C39A" p-id="2443"></path><path d="M860.421 441.539c-3.27 0-6.594-0.505-9.872-1.567-16.813-5.448-26.024-23.494-20.576-40.307l47.242-145.779c5.448-16.812 23.496-26.023 40.307-20.576 16.813 5.448 26.024 23.494 20.576 40.307l-47.242 145.779c-4.386 13.533-16.938 22.143-30.435 22.143z" fill="#15C39A" p-id="2444"></path></svg>
    </div>
    <iframe
      class="full"
      :width="rect.width"
      :height="rect.height - 50"
      :src="getIframe(rect.url)" 
      title="YouTube video player"
      :id="id"
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
    <!-- <div class="playmask" v-if="!isPlaying">
      <div class="playButton" @click="pressPlay"></div>
    </div> -->
  </div>
</template>
<script>
import { controlProject } from '@/socket/socket.teacher'
export default {
  props: {
    rect: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      id:'',
      ytPalyer: null,
      ytPalyerInstance: null,
      isPlaying: false,
      palyerStatus: -1,
      delay: null
    }
  },
  created() {
    this.id = `YouTube${this.rect.id}`
  },
  mounted() {
    console.log(this.id)
    this.ytPalyer = new YT.Player(this.id, {
        events: {
          'onReady': this.onYTReady,
          'onStateChange': this.onYTStateChange,
          'onError': (e) => {
            console.log(e, 'onError')
          }
        }
    });
    EventBus.$on('youtubePlayer', (data) => {
      const {id} = data
      if(id == this.rect.id) {
        this.handleSyncData(data)
      }
    })
  },
  methods: {
    getIframe(url){
      const formatId = url.split('?v=')[1]
      if(formatId) {
        return `https://www.youtube.com/embed/${formatId}`
      }
      return url
    },
    onYTReady(event) {
      this.ytPalyerInstance = event.target
    },
    onYTStateChange(event) {
      console.log(event, "onYTStateChange");
      const {data} = event
      this.palyerStatus = data
      if(data === 1) {
        // 在播放
        this.controlType(1)
      } else if(data === 2) {
        // 暂停
        this.isPlaying = false
        this.controlType(2)
      } else if(data === -1) {
        setTimeout(() => {
          // this.ytPalyerInstance.pauseVideo()
          console.log('奇了怪了', this.ytPalyerInstance.getPlayerState())
          this.ytPalyer.playVideo()
        }, 2000)
      }
    },
    pressPlay() {
      if(this.ytPalyerInstance) {
        this.ytPalyerInstance.playVideo()
        this.isPlaying = true
        this.controlType(1)
      }
    },
    controlType(nextStatus) {
      controlProject({"result": {"id": this.rect.id, "nextStatus": nextStatus},  "controlType": 5})
    },
    handleSyncData(data) {
      if(this.delay) clearTimeout(this.delay)
      this.delay = setTimeout(() => {
        this.handlePlayer(data)
      }, 100)
    },
    handlePlayer(data) {
      const {nextStatus, time} = data
      console.log(nextStatus, 'nextStatus')
      if(this.palyerStatus == nextStatus) return
      this.palyerStatus = nextStatus
      if(nextStatus === 1) {
        // 播放
        this.pressPlay()
      } else if(nextStatus === 2) {
        // 暂停
        if(this.ytPalyerInstance) {
          this.ytPalyerInstance.pauseVideo()
          this.isPlaying = false
        }
      } else if(nextStatus === 3) {
        // 进度同步
        if(this.ytPalyerInstance) {
          this.ytPalyerInstance.seekTo(time, true)
        }
      }
    },
    syncSeek() {
      const time = this.ytPalyerInstance.getCurrentTime()
      controlProject({"result": {"id": this.rect.id, "nextStatus": 3, "time": time},  "controlType": 5})
    }
  },
  
}
</script>
<style scoped>
.full{
  width: 100%;
  height: 100%;
  position: relative;
  line-height: 0;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  border: none !important;
}
.sync{
  margin: 0 auto;
  background-color: rgba(0,0,0,0.7);
  cursor: pointer;
  display: none;
  position: absolute;
  top: -50px;
  left: 0;
  width: 100%;
}
.full:hover .sync{
  display: block;
}
.playmask{
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background-color: rgba(0,0,0,0.7);
}
.playButton{
  width: 50px;
  height: 50px;
  background-image: url(../../assets/picture/youtubeplay.png);
  background-repeat: no-repeat;
  background-size: 50px 50px;
  cursor: pointer;
  margin-right: 20px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-25px, -25px);
}
</style>