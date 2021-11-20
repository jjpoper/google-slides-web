<template>
  <div >
    <div class="stundent-ppt-list" @mouseleave="hideList" v-show="showPPTList">
      <dash-top-ppt-list :changePage="changeSPage"/>
    </div>
    <div :class="`shouqi ${!showPPTList && 'zhankai'}`" @click="showList"></div>
  </div>
</template>
<script>
import dashTopPptList from '../teacher/dash/dashTopPptList.vue'
export default {
  props: {
    changePage: {
      type: Function
    }
  },
  components: { dashTopPptList },
  data() {
    return {
      showPPTList: false
    }
  },
  methods: {
    showList() {
      this.showPPTList = true
    },
    hideList() {
       this.showPPTList = false
    },
    changeSPage(index){
      this.changePage(index-1)
    }
  }
}
</script>
<style>
@import url(../../assets/css/dashpage.css);
</style>
<style scoped>
.stundent-ppt-list{
  position: fixed;
  width: 100%;
  z-index: 10000;
  top: 0;
  height: 120px;
}
.shouqi{
  width: 100px;
  height: 30px;
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50px);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  background-image: url(../../assets/picture/shouqi.png);
  cursor: pointer;
  z-index: 99;
}
.shouqi.zhankai{
  background-image: url(../../assets/picture/zhankai.png);
}
</style>