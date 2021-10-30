<template>
  <!-- <div class="fixprogress" v-if="progress > 0">
    <div class="progress">
      <span :style="`width: ${progress}%;`"><span>{{progress}}%</span></span>
    </div>
    <div class="cancel" @click="cancel" v-if="showCancel">cancel</div>
  </div> -->
  <el-dialog
    v-if="progress > 0"
    title="Uploading"
    visible
    :append-to-body="true"
    :show-close="false"
  >
    <div class="progress">
      <span :style="`width: ${progress}%;`"><span>{{progress}}%</span></span>
    </div>
    <div class="cancel" @click="cancel" v-if="showCancel">cancel</div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    },
    cancel: {
      type: Function,
      default: () => null
    },
    showCancel: {
      type: Boolean,
      default: true
    }
  }
}
</script>
<style scoped>
.fixprogress{
  position: fixed;
  top: 1px;
  width: 310px;
  right: 20px;
  z-index: 999;
  background-color: #b1abab;
  padding: 50px 10px;
  box-sizing: border-box;
  border-radius: 10px;
  height: 141px;
}
.progress {
  height: 20px;
  background: #ebebeb;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 10px;
}
.progress > span {
  position: relative;
  float: left;
  margin: 0 -1px;
  min-width: 40px;
  height: 18px;
  line-height: 16px;
  text-align: right;
  border: 1px solid;
  border-radius: 10px;
  background: rgba(21, 195, 154, 1);
  border-color: rgba(21, 195, 154, 1);
}
.progress .green {
 
}
.progress > span > span {
  padding: 0;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px rgba(255, 255, 255, 0.4);
}
.cancel{
  width: 100px;
  height: 30px;
  background: rgba(21, 195, 154, 1);
  text-align: center;
  line-height: 30px;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
  font-weight: bolder;
  margin: 10px auto 0;
}
</style>