<template>
  <div v-if="url" class="ppt">
    <div v-if="teacher" class="teacherppt" :style="`width: ${width}px; height: ${height}px; background-image:url(${url})`">
    </div>
    <div v-else class="ppt teacherppt" :style="`height: ${height}px; background-image:url(${url})`"></div>
    <div class="medialist" v-if="rectMediaList && rectMediaList.length > 0">
        <VueDragResize v-for="(rect, index) in rectMediaList"
            :key="rect.url"
            :w="rect.width"
            :h="rect.height"
            :x="rect.left"
            :y="rect.top"
            :parentW="width"
            :parentH="height"
            :axis="rect.axis"
            :isActive="rect.active"
            :minw="rect.minw"
            :minh="rect.minh"
            :isDraggable="rect.draggable"
            :isResizable="rect.resizable"
            :parentLimitation="rect.parentLim"
            :snapToGrid="rect.snapToGrid"
            :aspectRatio="rect.aspectRatio"
            :z="rect.zIndex"
            :contentClass="rect.class"
            v-on:activated="activateEv(index)"
            v-on:deactivated="deactivateEv(index)"
            v-on:dragging="changePosition($event, index)"
            v-on:resizing="changeSize($event, index)"
          >
              <div v-if="rect.type === 'image'" class="meidaitem teacherppt" :style="`width:100%; height: 100%;background-image:url(${rect.url})`"></div>
              <div v-if="rect.type === 'iframe'" class="meidaitem teacherppt" style="width:100%; height: 100%;">
                <iframe style="width:100%; height: 100%;" width="300" height="200" :src="getIframe(rect.url)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                <div class="mask"></div>
              </div>
          </VueDragResize>
      </div>
  </div>
</template>
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
</style>

<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import VueDragResize from 'vue-drag-resize';
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    teacher: {
      type: Boolean,
      default: false,
    },
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  computed: {
    rectMediaList () {
      const list = this.filterAddedMediaList.map((item) => {
        return {
          'width': 300,
          'height': 200,
          'top': 10,
          'left': 10,
          'draggable': true,
          'resizable': true,
          'minw': 50,
          'minh': 50,
          'axis': 'both',
          'parentLim': true,
          'snapToGrid': false,
          'aspectRatio': false,
          'zIndex': 1,
          'color': '#EF9A9A',
          'active': false,
          ...item
        }
      })
      console.log(list)
      return list
    }
  },
  components: {
    VueDragResize
  },
  data() {
    return {
      width: 0,
      height: 0,
    }
  },
  mounted() {
    this.width = document.documentElement.clientWidth - 40;
    this.height = document.documentElement.clientHeight - 40;
    console.log(this.filterAddedMediaList)
  },
  methods: {
    getIframe(url){
      const formatId = url.split('?v=')[1]
      if(formatId) {
        return `https://www.youtube.com/embed/${formatId}`
      }
      return url
    },
    activateEv(index) {
        // this.$store.dispatch('rect/setActive', {id: index});
    },
    deactivateEv(index) {
        // this.$store.dispatch('rect/unsetActive', {id: index});
    },
    changePosition(newRect, index) {
        // this.$store.dispatch('rect/setTop', {id: index, top: newRect.top});
        // this.$store.dispatch('rect/setLeft', {id: index, left: newRect.left});
        // this.$store.dispatch('rect/setWidth', {id: index, width: newRect.width});
        // this.$store.dispatch('rect/setHeight', {id: index, height: newRect.height});
    },
    changeSize(newRect, index) {
        // this.$store.dispatch('rect/setTop', {id: index, top: newRect.top});
        // this.$store.dispatch('rect/setLeft', {id: index, left: newRect.left});
        // this.$store.dispatch('rect/setWidth', {id: index, width: newRect.width});
        // this.$store.dispatch('rect/setHeight', {id: index, height: newRect.height});
    }
  }
}
</script>