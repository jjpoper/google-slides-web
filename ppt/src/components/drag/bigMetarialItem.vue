<template>
  <div class="mediaFour" v-if="vList.length > 0">
    <div :class="`mediaFourItem ${vList.length === 1 ? 'mediaFourItemfull' : ''}`" v-for="item in vList" :key="item.id">
      <div v-if="item.type === 'image'" class="meidaitem teacherppt full" >
        <img :src="item.url" class="full"/>
      </div>
      <div v-if="item.type === 'video'" class="meidaitem teacherppt full" >
        <VideoPlayer :src="item.url" class="full"
          controlslist="nodownload"
          controls/>
      </div>
      <div v-if="item.type === 'audio'" class="meidaitem teacherppt" style="width: 100%">
        <audio-player :url="item.url"  style="width: 100%"/>
      </div>
      <div v-if="item.type === 'iframe'" class="meidaitem teacherppt full" >
        <youtube :rect="item"/>
      </div>
      <div class="rightClose" @click="deleteItem(item.id)">
        <i
          class="el-icon-close cursor"
          style="font-size: 30px; color: #000"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import AudioPlayer from '../common/audioPlayer.vue';
import Youtube from './youtube.vue';
import { mapState, mapActions } from "vuex";
export default {
  props: {
    list: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  computed: {
    ...mapState({
      selectedMetarialIds: state => state.metarial.selectedMetarialIds,
    }),
    vList() {
      console.log('======', this.selectedMetarialIds)
      if(this.list) {
        let result = []
        for(let i = 0 ; i < this.selectedMetarialIds.length; i++) {
          const id = this.selectedMetarialIds[i]
          const item = this.list.find(item => item.id == id)
          if(item) {
            result.push(item)
          }
        }
        return result
      }
      return []
    }
  },
  components: {
    AudioPlayer,
    Youtube
  },
  mounted() {
    EventBus.$on("MeterialStatusChange", this.handleChange)
  },
  beforeDestroy() {
    EventBus.$off("MeterialStatusChange", this.handleChange)
  },
  methods: {
    ...mapActions("metarial", [
      "deleteSelectedMetarialId"
    ]),
    deleteItem(id) {
      this.deleteSelectedMetarialId(id)
    },
    handleChange(id, status) {
      if(status == 1) {
        // 播放
      } else if(status == 2) {
        // 暂停
      } else if(status == 3) {
        // 进度调整
      }
    }
  }
}
</script>

<style scoped>
.mediaFour{
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  flex-wrap: wrap;
  overflow: hidden;
  height: 100%;
}
.mediaFourItem{
  width: 50%;
  height: 50%;
  overflow: hidden;
  padding: 10px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dbd4d4;
}
.mediaFourItemfull{
  width: 100%;
  height: 100%;
}
.rightClose{
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255, 0.5);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.full{
  width: 100%;
  height: 100%;
  position: relative;
  line-height: 0;
  overflow: hidden;
}
</style>