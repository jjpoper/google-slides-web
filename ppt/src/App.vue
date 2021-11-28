<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import url(./assets/css/common.scss);
@import url(./assets/css/modal.scss);
</style>
<script>
import "./utils/pptConfig";
export default {
  mounted() {
    window.winWidth = document.documentElement.clientWidth;
    window.winHeight = document.documentElement.clientHeight;

    window.onblur = function(e){
      // // console.log("未激活状态！ window状态")
      window.isWindowActive = false
    }
    window.onfocus = function(e){
      // // console.log("激活状态！window状态")
      window.isWindowActive = true
    }
    document.body.onmouseleave = function(e){
      // // console.log("未激活状态！ window状态")
      window.isWindowActive = false
    }
    document.body.onpointerenter = function(e){
      // // console.log("激活状态！window状态")
      window.isWindowActive = true
    }
  },
};
</script>
