<template>
  <div class="ppt">
    <img  :src='url'>
  </div>
</template>
<style scoped>
.ppt{
  width: 100%;
  height: 100%;
}
img{
  max-width: 1000px;
  max-height: 1000px;
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
