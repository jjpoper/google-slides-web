<template>
  <div style="background-color: #E9EEF3;">
    <div class="mark-area">
      <pptcontent :url="url"/>
      <div
        v-for="(item, index) in marks"
        :key="index"
        :class="`markitem ${selectedIndex === index ? 'markitemhover' : ''}`"
        :style="`top:${item.top}px;left:${item.left}px;`"
        @click.stop="selectMark(item, index)"
      >
        <div class="innermark" :style="`background-color:${item.background || 'red'}; `"/>
      </div>
    </div>   
    <div class="right-area">
      <recordCommentList :list="marks" :selectedIndex="selectedIndex"/>
    </div>
  </div>
</template>
<script>
import recordCommentList from "../common/recordCommentList.vue";
import pptcontent from '../pptcontent.vue';
export default {
  components: {pptcontent, recordCommentList },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      }
    },
    url: {
      type: String,
      default: ''
    },
    pageId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      selectedIndex: -1,
      currentPageId: 0,
      marks: [],
    };
  },
  created() {
    console.log(this.list)
    this.marks = this.list.map((item) => {
      return {
        ...item,
        ...item.data
      }
    })
  },
  methods: {
    selectMark(item, index) {
      this.selectedIndex = index
    },
  }
};
</script>

<style scoped>
.mark-area {
  position: fixed;
  width: 70%;
  top: 50px;
  left: 0;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  overflow: hidden;
}
.right-area{
  width: 30%;
  float: right;
}
.markitem {
  width: 30px;
  height: 30px;
  border-radius: 15px;
  box-sizing: border-box;
  position: absolute;
  z-index: 999;
  cursor: pointer;
  border: 2px solid transparent;
}
.markitemhover{
  box-shadow: 0 0 20px #f00
}
.markitem:hover{
  box-shadow: 0 0 20px #f00
}
.innermark{
  width: 20px;
  height: 20px;
  border-radius: 10px;
  margin: 3px;
}
</style>