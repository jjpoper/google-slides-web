<template>
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
  </el-dialog>
</template>
<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style scoped>
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
  min-width: 30px;
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
  padding: 0 8px;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px rgba(255, 255, 255, 0.4);
}
</style>