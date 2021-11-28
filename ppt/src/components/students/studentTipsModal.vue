<template>
  <div v-show="tipsValue">
    <el-dialog
      :visible.sync="dashTipsModalVisiable"
      custom-class="custom-dialog"
      width="80%"
      :append-to-body="true"
    >
      <div class="copy_page">
        <img
          src="../../assets/picture/closecom.png"
          width="20"
          height="20"
          class="close-btn"
          @click="close"
        />
      <div class="student-tips">{{tipsValue}}</div>
      </div>
    </el-dialog>
    <div
      :class="dashTipsModalVisiable ? 'button_area back_focus' : 'button_area'"
      style="margin-right: 20px"
    >
      <div class="meterialimage" @click="showDashTips">
        <div class="fullbgimg dash-tip"></div>
        <i v-show="unreadMap[currentPageIndex]" class="unread"></i>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState} from 'vuex'
export default {
  computed: {
    currentTips() {
      if(this.studentAllSlides.length > 0) {
        const {elements} = this.studentAllSlides[this.currentPageIndex]
        const tipItemIndex = elements.findIndex(ele => ele.type === 'tip')
        return elements[tipItemIndex]
      }
      return null
    },
    ...mapState({
      studentAllSlides: state => state.student.studentAllSlides,
      currentPageIndex: state => state.student.currentPageIndex,
    }),
  },
  watch: {
    currentTips() {
      this.setTipText()
    },
    currentPageIndex() {
      this.close()
    }
  },
  data() {
    return {
      tipsValue: '',
      dashTipsModalVisiable: false,
      unreadMap: {}
    }
  },
  mounted() {
    this.setTipText()
    EventBus.$on("set-unread-tip", () => {
      if(!this.dashTipsModalVisiable) {
        this.unreadMap[this.currentPageIndex] = true
      }
    });
  },
  methods: {
    setTipText() {
      if(this.currentTips) {
        this.tipsValue = this.currentTips.tip
      } else {
        this.tipsValue = ''
      }
    },
    showDashTips() {
      this.dashTipsModalVisiable = true
      // 已读
      this.unreadMap[this.currentPageIndex] = false
    },
    close() {
      this.dashTipsModalVisiable = false
    }
  }
};
</script>

<style scoped>
.copy_page {
  width: 100%;
  /* max-height: 500px; */
  background: rgba(255, 255, 255, 1);
  opacity: 1;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  padding-top: 110px;
}
.close-btn{
  position: absolute;
  top: 15px;
  right: 15px;
  cursor: pointer;
}
.student-tips{
  display: flex;
  background-image: url(../../assets/picture/smalltips.png);
  background-size: 62px 66px;
  background-repeat: no-repeat;
  min-height: 66px;
  min-width: 62px;
  padding-left: 70px;
  line-height: 66px;
  align-self: center;
  margin: 0 50px 50px;
}
.button_area{
  height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #36425A;
  overflow: hidden;
  cursor: pointer;
}
.meterialimage{
  width: 30px;
  height: 30px;
  position: relative;
}
.button_area {
  margin-top: 5px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #36425A;
  overflow: hidden;
  cursor: pointer;
  padding: 3px 15px;
}
.dash-tip{
  background-image: url(../../assets/picture/dash-tip.png);
}
.back_focus {
  background-color: #fff;
  border-radius: 8px;
}
.unread{
  width: 15px;
  height: 15px;
  border-radius: 15px;
  position: absolute;
  top: 0;
  right: 0;
  background: red;
}
</style>