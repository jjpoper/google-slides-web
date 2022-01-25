<template>
  <div class="base64img" :style="`background-image:url(${url})`">
    <slot />
    <preview-button :url="url" v-if="showPreview"/>
  </div>
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
import previewButton from './common/previewButton.vue'
export default {
  components: { previewButton },
  props: {
    url: {
      type: String,
      default: ''
    },
    showPreview: {
      type: Boolean,
      default: false
    }
  },
}
</script>