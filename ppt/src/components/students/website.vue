<template>
  <div
    :style="`width: 100%; height: ${webHeight}px; border: none;`"
    class="page"
  >
    <iframe
      id="iframe_div"
      class="website"
      :style="`width: 100%; height: ${webHeight}px; border: none`"
      :src="`${data.items[0].data.url}`"
    />
    <div @click="openUrl" class="note--div">
      Viewing
      <div class="url--text">{{ data.items[0].data.url }}</div>
    </div>
    <!--  -->
  </div>
</template>
<style scoped>
.page {
  display: flex;
  flex-direction: column;
}
.website {
  width: 100%;
  height: 94%;
}
.note--div {
  height: 6%;
  width: 100%;
  border: none;
  border-radius: 0px;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  color: white;
  background-color: #7a9494;
  padding-left: 10px;
  box-sizing: border-box;
  font-size: 16px;
  font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
.url--text {
  color: #c9de55;
  font-size: 16px;
  cursor: pointer;
  margin-left: 10px;
}
.url--text:hover {
  color: #29abe2;
}
</style>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      webHeight: window.winHeight - 120,
    };
  },

  mounted() {},
  methods: {
    openUrl() {
      window.open(this.data.items[0].data.url);
    },
  },
};
</script>
