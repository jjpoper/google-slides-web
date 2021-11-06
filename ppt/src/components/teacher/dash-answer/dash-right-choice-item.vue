<template>
  <div class="remark-item-content" >
    <div class="remark-file" style="flex-direction: column; justify-content: center">
      <p class="file-name"  v-for="item in answerList" :key="item">{{getText(item)}}</p>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // answerList: [],
      optFlags: ["A", "B", "C", "D", "E", "F", "G", "H"]
    }
  },
  created() {
   
  },
  computed: {
    ...mapGetters({
      currentPagePPTData: 'student/currentPagePPTData',
    }),
    answerList() {
      const answer = JSON.parse(this.item.answer)
      const isArray = Object.prototype.toString.call(answer) === '[object Array]'
      console.log(this.item, 'this.answerList')
      return isArray ? answer : [answer]
    }
  },
  methods: {
    getText(answerId) {
      const {options} = this.currentPagePPTData.items[0].data;
      return this.optFlags[answerId] + '：' + options.filter(i => i.id == answerId)[0].text
    }
  }
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>