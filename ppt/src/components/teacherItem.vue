<template>
  <div>
    <b>{{title}}</b>
    <template>
      <div class="item" v-for="item in options" :key="item.id">{{item.text}}</div>
    </template>
  </div>
</template>
<style scoped>
.item{
  /* width: 100%; */
  margin: 10px;
  /* display: inline-block; */
  height: 50px;
  background-color: #fff;
  border-radius: 10px;
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
};
</script>
