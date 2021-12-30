<template>
  <div v-if="rect.id" :class="`mitem ${ isSelected ? 'selected-rect' : ''}`">
    <el-popover
    v-if="rect.source !== 'add-on' && teacher"
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
          <video
            :src="rect.url"
            class="full"
          />
        </div>
        <div v-if="rect.type === 'audio'" class="meidaitem teacherppt full" >
          <audio-player :url="rect.url" class="full"/>
        </div>
        <div v-if="rect.type === 'iframe'" class="meidaitem teacherppt full" >
          <youtube :rect="rect"/>
        </div>
        <div v-if="rect.type === 'website'" class="meidaitem teacherppt full" >
          <img @click="clickWebsite(rect.url)"  src="../../assets/picture/websiteicon.png" style="width: 60px; height: 60px"/>
        </div>
        <div class="transformmask" @click="choose"></div>
      </div>
    </el-popover>
    <div class="full" slot="reference" v-else>
      <div v-if="rect.type === 'image'" class="meidaitem teacherppt full" >
        <img :src="rect.url" class="full"/>
      </div>
      <div v-if="rect.type === 'video'" class="meidaitem teacherppt full" >
        <video
          :src="rect.url"
          class="full"
        />
      </div>
      <div v-if="rect.type === 'audio'" class="meidaitem teacherppt full" >
        <audio-player :url="rect.url" class="full"/>
      </div>
      <div v-if="rect.type === 'iframe'" class="meidaitem teacherppt full" >
        <youtube :rect="rect"/>
      </div>
      <div v-if="rect.type === 'website'" class="meidaitem teacherppt full" >
        <img @click="clickWebsite(rect.url)"  src="../../assets/picture/websiteicon.png" style="width: 60px; height: 60px"/>
      </div>
      <div class="transformmask" @click="choose"></div>
    </div>
  </div>
</template>
<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import AudioPlayer from '../common/audioPlayer.vue';
import Youtube from './youtube.vue';
import { mapActions, mapState } from "vuex";
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
    },
    ...mapState({
      selectedMetarialIds: state => state.metarial.selectedMetarialIds,
    }),
    isSelected() {
      return this.rect && this.selectedMetarialIds.indexOf(this.rect.id) > -1
    }
  },
  components: {
    AudioPlayer,
    Youtube
  },
  methods: {
    ...mapActions("metarial", [
      "addSelectedMetarialId",
      "deleteSelectedMetarialId"
    ]),
    choose() {
      if(!this.isSelected) {
        this.addSelectedMetarialId(this.rect.id)
      } else {
        this.deleteSelectedMetarialId(this.rect.id)
      }
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
  width: 120px;
  height: 60px;
  margin: 15px 2.5px;
  cursor: pointer;
}
.mitem:hover{
  transform: scale(1.2);
}
.selected-rect{
  border: 1px solid red;
}
</style>