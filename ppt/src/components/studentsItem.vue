<template>
  <div>
    <b>{{title}}</b>
    <template>
      <div class="item" v-for="item in options" :key="item.id">
        <el-radio v-model="radio" :label="item.id"  class="ra">{{item.text}}</el-radio>
      </div>
    </template>
  </div>
</template>
<style scoped>
.item{
  /* width: 100%; */
  /* width: 50%; */
  margin: 10px;
  /* display: inline-block; */
  height: 50px;
  /* border: 1px solid #fff; */
  background-color: #fff;
  border-radius: 10px;
  line-height: 50px;
  position: relative;
}
.ra{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 50px;
}
</style>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radio: null
    }
  }
};
</script>
