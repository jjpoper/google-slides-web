<template>
  <div class="remark-item-content">
    <div class="remark-file">
      <p class="file-name">{{item.content}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>