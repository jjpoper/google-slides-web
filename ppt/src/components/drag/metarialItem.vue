<template>
  <div v-if="rect.id" class="mitem">
    <el-popover
    placement="right"
    trigger="hover"
    class="drag-popover"
    :append-to-body="false"
    :popper-options="{
      boundariesElement: 'body',
      gpuAcceleration: true,
      positionFixed: true,
      preventOverflow: true
    }">
      <div class="dragselector">
        <i
          class="el-icon-rank dragitem cursor"
          style="font-size: 30px; color: #777"
        ></i>
        <i
          v-if="rect.source !== 'add-on' && teacher"
          class="el-icon-delete cursor"
          style="font-size: 30px; margin-left:10px; color: #777"
          @click="deleteMedia(index)"
        ></i>
      </div>
      <div class="full" slot="reference">
        <div v-if="rect.type === 'image'" class="meidaitem teacherppt full" >
          <img :src="rect.url" class="full"/>
        </div>
        <div v-if="rect.type === 'video'" class="meidaitem teacherppt full" >
          <VideoPlayer :src="rect.url" class="full"
            controlslist="nodownload"
            controls/>
        </div>
        <div v-if="rect.type === 'audio'" class="meidaitem teacherppt full" >
          <audio-player :url="rect.url" class="full"/>
        </div>
        <div v-if="rect.type === 'iframe'" class="meidaitem teacherppt full" >
          <youtube :rect="rect"/>
          <!-- <div class="mask"></div> -->
        </div>
        <div v-if="rect.type === 'website'" class="meidaitem teacherppt full" >
          <!-- <svg 
            @click="clickWebsite(rect.url)" 
            t="1633605041607" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4212" width="60" height="60">
            <path d="M283.306667 464.213333c3.413333 6.826667 10.24 6.826667 13.653333 6.826667h3.413333c6.826667 0 13.653333-6.826667 13.653334-13.653333C337.92 368.64 419.84 307.2 512 307.2h440.32c10.24 0 17.066667-6.826667 17.066667-17.066667 0-3.413333 0-6.826667-3.413334-10.24C880.64 105.813333 706.56 0 512 0 365.226667 0 221.866667 64.853333 126.293333 177.493333c-6.826667 3.413333-6.826667 13.653333-3.413333 20.48l160.426667 266.24z" fill="rgba(21, 195, 154, 1)" p-id="4213"></path><path d="M1000.106667 351.573333c-3.413333-6.826667-10.24-10.24-17.066667-10.24h-310.613333c-6.826667 0-13.653333 3.413333-17.066667 10.24s0 13.653333 3.413333 17.066667C696.32 409.6 716.8 457.386667 716.8 512c0 47.786667-17.066667 95.573333-47.786667 133.12-3.413333 3.413333-3.413333 3.413333-3.413333 6.826667v3.413333l-170.666667 341.333333c-3.413333 3.413333 0 10.24 0 17.066667s10.24 6.826667 13.653334 10.24h3.413333c283.306667 0 512-228.693333 512-512 0-54.613333-10.24-105.813333-23.893333-160.426667z" fill="rgba(21, 195, 154, 1)" p-id="4214"></path><path d="M583.68 713.386667c-3.413333-6.826667-10.24-6.826667-17.066667-6.826667-92.16 23.893333-184.32-13.653333-232.106666-92.16 0-3.413333-3.413333-3.413333-3.413334-3.413333l-3.413333-3.413334L109.226667 238.933333c-3.413333-6.826667-6.826667-10.24-13.653334-10.24s-13.653333 3.413333-17.066666 10.24C27.306667 320.853333 0 416.426667 0 512c0 252.586667 180.906667 464.213333 433.493333 505.173333h3.413334c6.826667 0 13.653333-3.413333 13.653333-10.24l136.533333-276.48c3.413333-3.413333 3.413333-10.24-3.413333-17.066666z" fill="rgba(21, 195, 154, 1)" p-id="4215"></path><path d="M341.333333 512c0 95.573333 75.093333 170.666667 170.666667 170.666667s170.666667-75.093333 170.666667-170.666667-75.093333-170.666667-170.666667-170.666667-170.666667 75.093333-170.666667 170.666667z" fill="rgba(21, 195, 154, 1)" p-id="4216"></path></svg>
           -->
          <img @click="clickWebsite(rect.url)"  src="../../assets/picture/websiteicon.png" style="width: 60px; height: 60px"/>
        </div>
        <div class="transformmask" @click="choose"></div>
      </div>
    </el-popover>
  </div>
</template>
<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import AudioPlayer from '../common/audioPlayer.vue';
import Youtube from './youtube.vue';
import { mapActions } from "vuex";
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    update: {
      type: Function,
      default: () => null
    },
    deleteMedia: {
      type: Function,
      default: () => null
    },
    teacher: {
      type: Boolean,
      default: false
    },
    rect: {
      type: Object,
      default: () => {
        return {}
      }
    },
  },
  computed: {
    parentW() {
      let width = 500
      try {
        if(this.parentWidth) {
          if(this.rect.source !== 'add-on' && this.teacher) {
            width = this.parentWidth - 100
          }
          width = this.parentWidth - 60
        }
      } catch(e){}
      return width
    }
  },
  components: {
    AudioPlayer,
    Youtube
  },
  methods: {
    ...mapActions("metarial", [
      "addSelectedMetarialId"
    ]),
    choose() {
      this.addSelectedMetarialId(this.rect.id)
    }
  }
}
</script>

<style scoped>
.teacherppt{
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center
}
.ppt{
  width: 100%;
  height: 100%;
  display: flow-root;
}
.medialist{
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  overflow-y: scroll;
  position: absolute;
  top: 0;
}
.meidaitem{
  width:300px; height: 200px;
}
.mask{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
}
.full{
  width: 100%;
  height: 100%;
  position: relative;
  line-height: 0;
  overflow: hidden;
}
.dragselector{
  /* position: absolute;
  top: -60px; */
  /* left: 50%; */
  /* height: 50px; */
  /* transform: translateX(-50%); */
  /* display: flex;
  align-items: center;
  justify-content: center;
  background-color: #777;
  padding: 0 10px;
  box-sizing: border-box;
  border-radius: 5px;
  z-index: 999; */
  display: flex;
  /* width: 50%; */
  justify-content: center;
}
.cursor{
  cursor: pointer;
}
.mitem{
  width: 95px;
  height: 50px;
  margin: 5px 2.5px;
  cursor: pointer;
}
</style>