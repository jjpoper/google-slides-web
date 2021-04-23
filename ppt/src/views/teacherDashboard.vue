<template>
  <div class="page">
    <div class="content">
      <div class="left">
        <div v-for="(item, index) in ppts" :key="index" class="pptContent">
          <img />

          <div></div>
        </div>
      </div>

      <div class="divider"></div>
    </div>
    <div class="number_info">Class Roster {{ current }}/{{ totalNumber }}</div>
  </div>
</template>

<style scoped>
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.content {
  display: flex;
  width: 100%;
  height: 100%;
}
.left {
  display: flex;
  width: 250px;
  height: 100%;
  background-color: antiquewhite;
}
.divider {
  width: 1px;
  height: auto;
  background-color: #606060;
}
.number_info {
  position: absolute;
  right: 60px;
  top: 20px;
  width: 150px;
  height: 30px;
  background-color: #409eff;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  padding-top: 13px;
}
.pptContent {
}
</style>

<script>
export default {
  data() {
    return {
      current: 2,
      totalNumber: 4,
      ppts: [],
    };
  },
  methods: {},
};
</script>
