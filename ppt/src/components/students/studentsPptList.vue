<template>
  <div >
    <div class="stundent-ppt-list" @mouseleave="hideList" v-show="showPPTList">
      <dash-top-ppt-list />
    </div>
    <div :class="`shouqi ${!showPPTList && 'zhankai'}`" @mouseenter="showList"></div>
  </div>
</template>
<script>
import dashTopPptList from '../teacher/dash/dashTopPptList.vue'
export default {
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
    }
  }
}
</script>
<style scoped>
.stundent-ppt-list{
  position: fixed;
  width: 100%;
  z-index: 10000;
  top: 0;
  background-color: red;
  height: 180px;
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