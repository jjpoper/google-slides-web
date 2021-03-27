<template>
  <div class="ppt">
    <img width="100%" :src='url'>
  </div>
</template>
<style scoped>
.ppt{
  width: 100%;
  /* height: 90%; */
}
</style>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    teacher: {
      type: Boolean,
      default: false,
    }
  },
};
</script>
