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
.remark-item-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin-bottom: 15px;
  padding: 15px;
  word-break: break-all;
  display: flex;
  align-items: center;
  justify-content: center;
}
.remark-file {
  height: 60px;
  display: flex;
  align-items: center;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.file-icon {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.file-icon.pdf {
  background-image: url(../../../assets/picture/pdf.png);
}
.file-icon.word {
  background-image: url(../../../assets/picture/word.png);
}
.file-icon.file {
  background-image: url(../../../assets/picture/file.png);
}
.download-text {
  text-decoration: none;
  text-align: left;
  float: left;
  padding-right: 20px;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right;
  background-image: url(../../../assets/picture/download.png);
  background-size: 12px 11px;
  cursor: pointer;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #15c39a;
}
.file-name {
  font-size: 10px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
}
</style>