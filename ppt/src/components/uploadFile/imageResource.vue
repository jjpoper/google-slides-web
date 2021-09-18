<template>
  <div class="page">
    <img
      style="width: 150px; height: 70px"
      src="../../assets/icon_source/pdf_icon.png"
      fit="contain"
    />

    <img
      style="width: 150px; height: 70px"
      src="../../assets/icon_source/video_icon.png"
      fit="contain"
    />

    <img
      style="width: 150px; height: 70px"
      src="../../assets/icon_source/voice@2x.png"
      fit="contain"
    />

    <img
      style="width: 150px; height: 70px"
      src="../../assets/icon_source/web@2x.png"
      fit="contain"
    />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 1000px;
  height: 100%;
}
</style>

<script>
export default {
  data() {
    return {
      imageList: [
        "../../assets/icon_source/pdf_icon.png",
        "../../assets/icon_source/video_icon.png",
        "../../assets/icon_source/voice@2x.png",
        "../../assets/icon_source/web@2x.png",
      ],
    };
  },
  mounted() {},
};
</script>
