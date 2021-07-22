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
</style>
<script>
import "./utils/pptConfig";
export default {
  mounted() {
    window.winWidth = document.documentElement.clientWidth;
    window.winHeight = document.documentElement.clientHeight;
  },
};
</script>
