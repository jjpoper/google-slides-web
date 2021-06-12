<template>
  <div class="page">
    <img src="../../assets/step_one.jpg" />

    <div class="opts">
      <el-button @click="openTwo()" type="primary">Got it</el-button>

      <span @click="hideStepOne()">Don't show this again</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    openTwo: {
      type: Function
    },
    hideStepOne: {
      type: Function
    }
  }
};
</script>

<style scoped>
.page {
  display: flex;
  width: 100%;
  flex-direction: column;
}

span {
  cursor: pointer;
  font-size: 18px;
  margin-right: 10px;
  text-decoration: underline;
}
.opts {
  display: flex;
  padding-top: 20px;
  width: 100%;
  align-items: center;
  flex-direction: row-reverse;
}
</style>