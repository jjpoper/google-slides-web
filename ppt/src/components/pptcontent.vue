<template>
  <div class="ppt">
    <img width="100%" :src='url'>
  </div>
</template>
<style scoped>
.ppt{
  width: 300px;
  height: 300px;
}
</style>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
  },
};
</script>
