<template>
  <div class="remark-item-content" >
    <div class="remark-file" style="flex-direction: column">
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
      answerList: [],
      optFlags: ["A", "B", "C", "D", "E", "F", "G", "H"]
    }
  },
  created() {
    this.answerList = JSON.parse(this.item.answer)
  },
  computed: {
    ...mapGetters({
      currentPagePPTData: 'student/currentPagePPTData',
    }),
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