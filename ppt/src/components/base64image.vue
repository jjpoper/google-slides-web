<template>
  <div class="base64img" :style="`background-image:url(${url})`"></div>
</template>
<style scoped>
.base64img{
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: absolute;
}
</style>
<script>
export default {
  props: {
    url: {
      type: String,
      default: ''
    }
  }
}
</script>