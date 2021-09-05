<template>
  <VueDragResize
    :w="rect.width"
    :h="rect.height"
    :x="rect.left"
    :y="rect.top"
    :parentW="parentWidth"
    :parentH="parentHeight"
    :axis="rect.axis"
    :isActive="false"
    :minw="rect.minw"
    :minh="rect.minh"
    :isDraggable="rect.draggable"
    :isResizable="rect.resizable"
    :parentLimitation="rect.parentLim"
    :snapToGrid="rect.snapToGrid"
    :aspectRatio="rect.aspectRatio"
    :z="rect.zIndex"
    :contentClass="rect.class"
    v-on:dragstop="changeData($event, index)"
    v-on:resizestop="changeData($event, index)"
    v-on:activated="positiveChange('activated')"
    v-on:deactivated="deactivated"
    dragHandle=".dragitem"
    ref="vueDrag"
  >
    <el-popover
    placement="right"
    trigger="hover"
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
          <video :src="rect.url" class="full"
            controlslist="nodownload"
            controls/>
        </div>
        <div v-if="rect.type === 'iframe'" class="meidaitem teacherppt full" >
          <iframe
          class="full" :width="rect.width" :height="rect.height" :src="getIframe(rect.url)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          <!-- <div class="mask"></div> -->
        </div>
      </div>
    </el-popover>
  </VueDragResize>
</template>
<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import VueDragResize from 'vue-drag-resize';
export default {
  props: {
    rect: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    },
    parentWidth: {
      type: Number,
      default: 0
    },
    parentHeight: {
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
    }
  },
  components: {
    VueDragResize
  },
  methods: {
    getIframe(url){
      const formatId = url.split('?v=')[1]
      if(formatId) {
        return `https://www.youtube.com/embed/${formatId}`
      }
      return url
    },
    changeData(newRect, index) {
      if(this.teacher && window.isWindowActive) {
        this.update(newRect, index)
      }
    },
    positiveChange(name) {
      // // console.log('notUpdate ==== changePosition positive change', name)
    },
    deactivated(name) {
      // // console.log('notUpdate ==== changePosition deactivated change', name)
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
  width: 100%;
  justify-content: center;
}
.cursor{
  cursor: pointer;
}
</style>