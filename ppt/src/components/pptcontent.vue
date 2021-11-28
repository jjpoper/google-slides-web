<template>
  <div v-if="url" class="ppt">
    <div v-if="teacher" class="teacherppt" :style="`width: ${width}px; height: ${height}px; background-image:url(${url})`">
    </div>
    <div class="teacherppt" :style="`height: 100%; background-image:url(${url})`">
      <student-questions v-if="isRemark" :teacher="teacher"/>
    </div>
    <div class="medialist" v-if="(meterialVisiable || defaultShowMeterial) && hasData && (teacher || isStudentPaced)">
        <template v-if="leftSortList && leftSortList.length">
          <element-drag v-for="rect in leftSortList" :key="rect.id"
              :index="rect.sortIndex" :rect="rect" :update="update" :deleteMedia="deleteMedia"
              :parentWidth="width"
              :teacher="teacher"
              :parentHeight="parentHeight"/>
        </template>
        <template>
          <element-drag v-for="rect in rectMediaList" :key="rect.id"
            :index="rect.sortIndex" :rect="rect" :update="update" :deleteMedia="deleteMedia"
            :parentWidth="width"
            :teacher="teacher"
            :parentHeight="parentHeight"/>
        </template>
    </div>
  </div>
</template>

<script>
import { ModalEventsNameEnum } from '@/socket/socketEvents';
import { mapState } from 'vuex'
import ElementDrag from './drag/elementDrag.vue';
import StudentQuestions from './students/studentQuestions.vue';
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
    isStudentPaced: {
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
    ...mapState({
      isRemark: state => state.remark.isRemark,
    }),
  },
  watch: {
    filterAddedMediaList () {
     this.filterList()
    }
  },
  components: {
    ElementDrag,
    StudentQuestions
  },
  data() {
    return {
      width: 0,
      height: 0,
      parentHeight: 0,
      rectMediaList: [],
      leftSortList: [],
      hasData: false
    }
  },
  created() {
    this.rectingDelay = null
    this.sizeDelay = null
    this.filterList()
  },
  mounted() {
    this.width = document.documentElement.clientWidth - this.widthOffset;
    this.height = document.documentElement.clientHeight - 110;
    this.parentHeight = this.height - 76
    // if(!this.defaultShowMeterial) {
    //   EventBus.$on(ModalEventsNameEnum.MEDIA_MODAL_VISIBLE, (status) => {
    //     this.meterialVisiable = status
    //     // console.log(status)
    //   })
    // }
  },
  methods: {
    filterList () {
      if(!this.filterAddedMediaList) return
      let i = 0
      let rectList = []
      let leftList = []
      for(i ; i < this.filterAddedMediaList.length ; i ++) {
        const item = this.filterAddedMediaList[i]
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
        const listItem = {
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
          sortIndex: i,
          ...item
        }
        // top  left 都是0，在左边从上往下排布
        if(params.top === 0 && params.left === 0) {
          listItem.top = leftList.length * 60 + 60
          // listItem.left = leftList.length * 30
          listItem.width = 60
          listItem.height = 60
          leftList.push(listItem)
        } else {
          rectList.push(listItem)
        }
      }
      this.hasData = leftList.length > 0 || rectList.length > 0
      this.rectMediaList = rectList
      this.leftSortList = leftList
      console.log(this.meterialVisiable, this.defaultShowMeterial, this.hasData)
    },
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
        // console.log(newRect, data)
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
  background-position: center;
  position: relative;
  margin: 0 auto;
}
.ppt{
  width: 100%;
  height: 100%;
  display: flow-root;
  position: relative;
}
.medialist{
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  height: 100%;
  overflow: hidden;
  position: absolute;
  top: 0;
  z-index: 1001;
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
.cursor{
  cursor: pointer;
}
.leftView{
  width: 150px;
  position: absolute;
  left: 0;
  overflow-y: scroll;
}
.innerleftView{

}
</style>