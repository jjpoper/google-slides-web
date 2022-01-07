<template>
  <div class="remark-item-content">
    <div class="remark-file">
      <p class="file-name">{{getText(item)}}</p>
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
  methods: {
    getText(item) {
      if (item.content) {
        return item.content;
      }
      return "Deleted response";
    },
  }
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>