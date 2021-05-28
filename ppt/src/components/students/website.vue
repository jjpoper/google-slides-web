<template>
  <div :style="`width: 100%; height: ${webHeight}px; border: none`">
    <iframe class="website" :style="`width: 100%; height: ${webHeight}px; border: none`" :src="`https://${data.items[0].data.url}`"/>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      webHeight: window.winHeight  - 50
    }
  },
}
</script>
