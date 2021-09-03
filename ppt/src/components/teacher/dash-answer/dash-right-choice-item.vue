<template>
  <div class="remark-item-content">
    <div class="remark-file">
      <p class="file-name">{{getText()}}</p>
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
      optFlags: ["A", "B", "C", "D", "E", "F", "G", "H"]
    }
  },
  computed: {
    ...mapGetters({
      currentPagePPTData: 'student/currentPagePPTData',
    }),
  },
  methods: {
    getText() {
      const {options} = this.currentPagePPTData.items[0].data;
      return this.optFlags[this.item.answer] + '：' + options.filter(i => i.id == this.item.answer)[0].text
    }
  }
}
</script>
<style scoped>
@import url(./dash-right.css);
</style>