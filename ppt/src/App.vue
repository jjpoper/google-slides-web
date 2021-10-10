<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: auto;
}
ul,li{
  list-style: none;
}

html, button, input, select, textarea {
    font-family: ProximaNovaSoft-Medium, sans-serif;
    font-weight: normal;
    font-style: normal;
    color: #7a9494;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  // width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #F4F4F4;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

/*显示文字*/
.metrial .el-switch__label {
  color: #fff
}
.flex-center{
  display: flex;
  justify-content: center;
  align-items: center;
}
.transformmask{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}
.fullbgimg{
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: absolute;
}
::-webkit-scrollbar {
    display: none;
}
.transparent-content{
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
.no-border{
  border: 1px solid rgba(236, 236, 236, 1);
}
.no-padding{
  margin-top: 50px !important;
}
.no-padding >.el-dialog__header{
  display: none !important;
}
.no-padding >.el-dialog__body{
  padding: 0 !important;
}
.custom-dialog.el-dialog {
  margin: 50px auto 0 !important;
  .el-dialog__header {
    display: none;
  }
}
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
