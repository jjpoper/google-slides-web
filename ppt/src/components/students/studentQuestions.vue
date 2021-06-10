<template>
    <div class="mark-area" @click="markup($event)">
      <div v-for="(item, index) in marks" :key="index" class="markitem" :style="`top:${item.top}px;left:${item.left}px`"></div>
      <div class="">
      </div>
    </div>
</template>
<style scoped>
.mark-area{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  background-color: transparent;
}
.markitem{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: red;
  position: absolute;
}
</style>
<script>
export default {
  data() {
    return {
      marks: []
    }
  },
  mounted() {

  },
  methods: {
    markup(e) {
      // console.log(e)
      const {pageX: left, pageY: top} = e
      this.marks.push({left: left - 15, top: top - 15})
    }
  }
}
</script>