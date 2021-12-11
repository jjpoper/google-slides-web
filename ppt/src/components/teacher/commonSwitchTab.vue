<template>
  <div class="text-answer-tab">
    <el-tooltip content="List View" placement="top">
      <button :class="`button-row ${currentTab === 1 && 'active'}`" @click="changeNextTab(1)"></button>
    </el-tooltip>
    <el-tooltip content="Grid View" placement="top">
      <button :class="`button-colum ${currentTab === 2 && 'active'}`" @click="changeNextTab(2)"></button>
    </el-tooltip>
    <el-tooltip content="Overlaid View" v-if="hasStatics" placement="top">
      <button  :class="`button-statics ${currentTab === 3 && 'active'}`" @click="changeNextTab(3)"></button>
    </el-tooltip>
  </div>
</template>

<script>
import { controlProject } from '@/socket/socket.teacher'
export default {
  props: {
    currentTab: {
      type: Number,
      default: 1
    },
    changeTab: {
      type: Function,
      default: () => null
    },
    hasStatics: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    EventBus.$on('responseTabChange', this.listenterChangeTab)
  },
  beforeDestroy() {
    EventBus.$off('responseTabChange', this.listenterChangeTab)
  },
  methods: {
    changeNextTab(tab) {
      controlProject({"result": {"tab": tab}, "controlType": 6})
      this.changeTab(tab)
      this.closePicture()
    },
    listenterChangeTab(result) {
      if(this.currentTab !== result.tab) {
        this.changeTab(result.tab)
      }
      this.closePicture()
    },
    closePicture() {
      if(document.pictureInPictureElement) {
        try {
          document.exitPictureInPicture()
        } catch(e) {}
      }
    }
  }
}
</script>


<style scoped>
.text-answer-tab{
  width: 100%;
  height: 90px;
  display: flex;
  align-items: center;
}
.text-answer-tab button{
  width: 32px;
  height: 32px;
  margin-right: 22px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 32px 32px;
  cursor: pointer;
  border: none;
}
.button-colum{
  background-image: url(../../assets/picture/colum.png);
}
.button-colum.active{
  background-image: url(../../assets/picture/colum-s.png);
}
.button-row{
  background-image: url(../../assets/picture/row.png);
}
.button-row.active{
  background-image: url(../../assets/picture/row-s.png);
}
.button-statics{
  background-image: url(../../assets/picture/static.png);
}
.button-statics.active{
  background-image: url(../../assets/picture/static-s.png);
}

</style>