<template>
  <div class="studentComment" :style="`height: ${webHeight}px; width: 200px`">
    <div v-for="(item) in filterTips" :key="item.id">
      <div class="rightcomment">
        <div
          class="section"
        >
          <p >{{item.tip}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    filterTips: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  data() {
    return {
      webHeight: window.winHeight,
    };
  },
}
</script>
<style scoped>
.studentComment{
  overflow-y: scroll;
  position: fixed;
  top: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #777;
}
.rightcomment {
  width: 100%;
  min-height: 30px;
  background-color: #fff;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  word-wrap: break-word;
  line-height: 20px;
}
.section {
  overflow: hidden;
  padding: 10px;
  position: relative;
}
.cl {
  position: absolute;
  top: 50%;
  width: 64px;
  height: 64px;
  right: 0;
  margin-top: -32px;
  cursor: pointer;
}
.del-comment{
  font-size: 15px; position: absolute; right: 5px; top: 5px;
  cursor: pointer;
}
</style>