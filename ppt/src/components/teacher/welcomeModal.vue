<template>
  <div class="welcomepage">
    <img src="../../assets/step_one.jpg"  style="width: 100%"/>

    <div class="opts">
      <el-button @click="hideWelcome" type="primary">Got it</el-button>

      <!-- <span @click="hideStepOne()">Don't show this again</span> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    hideWelcome: {
      type: Function
    },
    hideStepOne: {
      type: Function
    }
  },
  methods: {
    notShow() {

    }
  }
};
</script>

<style scoped>
.welcomepage {
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
  margin: 0 20px 20px;
}
</style>