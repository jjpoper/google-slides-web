<template>
  <div class="full">
    <iframe
      class="full"
      :width="rect.width"
      :height="rect.height"
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
    EventBus.$on('youtubePlayer', ({id, nextStatus}) => {
      if(id == this.rect.id) {
        this.handleSyncData(nextStatus)
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
    handleSyncData(nextStatus) {
      if(this.delay) clearTimeout(this.delay)
      this.delay = setTimeout(() => {
        this.handlePlayer(nextStatus)
      }, 100)
    },
    handlePlayer(nextStatus) {
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
      }
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