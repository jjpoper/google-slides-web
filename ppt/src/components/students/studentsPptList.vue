<template>
  <div class="stundent-ppt-list">
    <dash-top-ppt-list v-show="showPPTList"/>
    <div :class="`shouqi ${!showPPTList && 'zhankai'}`" @click="togglePPTList"></div>
  </div>
</template>
<script>
import dashTopPptList from '../teacher/dash/dashTopPptList.vue'
export default {
  components: { dashTopPptList },
  data() {
    return {
      showPPTList: true
    }
  },
  methods: {
    togglePPTList() {
      this.showPPTList = !this.showPPTList
    },
  }
}
</script>
<style scoped>
.stundent-ppt-list{
  position: fixed;
  top: 0;
  width: 100%;
  height: 180px;
  z-index: 1000;
}
.shouqi{
  width: 100px;
  height: 30px;
  position: absolute;
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