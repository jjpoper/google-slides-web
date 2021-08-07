<template>
  <div v-if="url" class="ppt">
    <div v-if="teacher" class="teacherppt" :style="`width: ${width}px; height: ${height}px; background-image:url(${url})`">
    </div>
    <div v-else class="ppt teacherppt" :style="`height: ${height}px; background-image:url(${url})`"></div>
    <div class="medialist" v-if="(meterialVisiable || defaultShowMeterial) && rectMediaList && rectMediaList.length > 0">
        <template>
          <element-drag v-for="(rect, index) in rectMediaList" :key="rect.id"
            :index="index" :rect="rect" :update="update" :deleteMedia="deleteMedia"
            :parentWidth="width"
            :teacher="teacher"
            :parentHeight="height"/>
        </template>
        <!-- <template v-else>
          <div v-for="rect in rectMediaList"
            :key="rect.url"
            :style="`width:${rect.width}px; height: ${rect.height}px; left:${rect.left}px;top:${rect.top}px;z-index:1;position: absolute`"
          >
              <div v-if="rect.type === 'image'" class="meidaitem teacherppt" :style="`width:100%; height: 100%;`">
                <img :src="rect.url" :style="`width:100%; height: 100%;`"/>
              </div>
              <div v-if="rect.type === 'iframe'" class="meidaitem teacherppt" style="width:100%; height: 100%;">
                <iframe style="width:100%; height: 100%;" :width="rect.width" :height="rect.height" :src="getIframe(rect.url)" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
          </div>
        </template> -->
    </div>
  </div>
</template>

<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import VueDragResize from 'vue-drag-resize';
import ElementDrag from './drag/elementDrag.vue';
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
    defaultShowMeterial: {
      type: Boolean,
      default: false,
    },
    meterialVisiable: {
      type: Boolean,
      default: false,
    },
    widthOffset: {
      type: Number,
      default: 40,
    },
  },
  computed: {
    rectMediaList () {
      if(!this.filterAddedMediaList) return []
      const list = this.filterAddedMediaList.map((item) => {
        console.log(item)
        const {position: {
          x = 200,
          y = 200,
          w = 150,
          h = 150,
          height = 150
        }} = item
        const params = this.teacher ? {
          'width': w || 150,
          'height': h || height || 150,
          'top': y,
          'left': x,
        } : {
          'width': 150,
          'height': 150,
          'top': 0,
          'left': 0
        }
        return {
          ...params,
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
    ElementDrag
  },
  data() {
    return {
      width: 0,
      height: 0,
    }
  },
  created() {
    this.rectingDelay = null
    this.sizeDelay = null
  },
  mounted() {
    this.width = document.documentElement.clientWidth - this.widthOffset;
    this.height = document.documentElement.clientHeight - 40;
    // if(!this.defaultShowMeterial) {
    //   EventBus.$on(ModalEventsNameEnum.MEDIA_MODAL_VISIBLE, (status) => {
    //     this.meterialVisiable = status
    //     console.log(status)
    //   })
    // }
  },
  methods: {
    getIframe(url){
      const formatId = url.split('?v=')[1]
      if(formatId) {
        return `https://www.youtube.com/embed/${formatId}`
      }
      return url
    },
    update(newRect, index) {
      if(this.rectingDelay) clearTimeout(this.rectingDelay)
      const data = this.filterAddedMediaList[index]
      this.rectingDelay = setTimeout(() => {
        console.log(newRect, data)
        const {
          height: h,
          left: x,
          top: y,
          width: w,
        } = newRect
        const upData = {
          ...data,
          position: {
            x,
            y,
            w,
            h
          }
        }
        EventBus.$emit(ModalEventsNameEnum.UPDATE_MEDIA_ELEMENT, upData);
      }, 300)
    },
    deleteMedia(index) {
      const {id} = this.filterAddedMediaList[index]
      EventBus.$emit(ModalEventsNameEnum.DELETE_MEDIA_ELEMENT, id);
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