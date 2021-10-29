<template>
  <div class="panel">
    <el-dialog
      :visible.sync="dashTipsModalVisiable"
      custom-class="custom-dialog"
      width="80%"
      :append-to-body="true"
    >
      <dash-tips-modal :close="showDashTips" :isTeacher="false" />
    </el-dialog>
    <div
      :class="dashTipsModalVisiable ? 'button_area back_focus' : 'button_area'"
      style="margin-right: 20px"
    >
      <div class="meterialimage" @click="showDashTips">
        <div class="fullbgimg dash-tip"></div>
      </div>
    </div>
    <div v-if="currentModel == 'Student-Paced'" class="arrow_opts">
      <button class="control-bar__button">
        <div class="control-bar__icon" @click="lastPage()">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35.12 60.82">
            <title>icon-control-btn__arrow</title>
            <path
              d="M14.44,31.91A8.54,8.54,0,0,0,17,38l8.93,9L39.47,60.67a5.64,5.64,0,0,0,8.15,0,6.58,6.58,0,0,0,0-8.93l-6.59-7-6.41-7-5.81-5.88,5.81-5.68,6.6-7,6.59-7a6.57,6.57,0,0,0,0-8.92,5.65,5.65,0,0,0-4.07-1.73,5.75,5.75,0,0,0-4.08,1.74L26.1,16.75l-8.93,8.93A8.71,8.71,0,0,0,14.44,31.91Z"
              transform="translate(-14.44 -1.59)"
            />
          </svg>
        </div>
      </button>

      <button class="control-bar__button--large">
        <div class="pageIndex">{{ parseInt(currentPageIndex) + 1 }} of {{ totalPage }}</div>
      </button>

      <!-- <strong class="pageIndex"></strong> -->

      <button class="control-bar__button">
        <div class="control-bar__icon" @click="nextPage()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 35.12 60.82"
            class="svg_right"
          >
            <title>icon-control-btn__arrow</title>
            <path
              d="M14.44,31.91A8.54,8.54,0,0,0,17,38l8.93,9L39.47,60.67a5.64,5.64,0,0,0,8.15,0,6.58,6.58,0,0,0,0-8.93l-6.59-7-6.41-7-5.81-5.88,5.81-5.68,6.6-7,6.59-7a6.57,6.57,0,0,0,0-8.92,5.65,5.65,0,0,0-4.07-1.73,5.75,5.75,0,0,0-4.08,1.74L26.1,16.75l-8.93,8.93A8.71,8.71,0,0,0,14.44,31.91Z"
              transform="translate(-14.44 -1.59)"
            />
          </svg>
        </div>
      </button>
    </div>

    <div class="info_area">
      <div class="checkboxs">
        <el-checkbox :value="currentAnswerd" style="color: #fff">
          slide {{ parseInt(currentPageIndex) + 1 }}/{{ totalPage }}
        </el-checkbox>
      </div>
    </div>

    <div class="aligncenter" v-if="currentModel == 'Student-Paced'">
      <div
        class="button_area"
        @click="changeMeterial"
      >
        <div class="meterialimage">
          <div :class="`fullbgimg ${meterialSwitchVisiable ? 'me-show' : 'me-hide'}`"></div>
        </div>
        <strong class="button_text">{{meterialSwitchVisiable ? 'Material hiding' : 'Display material'}}</strong>
      </div>
    </div>
    <div class="readchatouter">
      <img
        src="../../assets/picture/liaotian_icon.png"
        class="readchat"
        @click="showStudentModal"
      />
      <i :class="`${unread && 'unread'}`"></i>
    </div> 
    <div class="question_area" v-if="smallWindow" @click="changeShowOrAnswer()">
      {{ isShowQuestion ? "Answer " : "Show " }}Question
    </div>
  </div>
</template>
<script>
import { ClassRoomModelEnum } from "../../socket/socketEvents";
import {mapState} from 'vuex'
import dashTipsModal from '../teacher/dashTipsModal.vue';
export default {
  components: { dashTipsModal },
  computed: {
    ...mapState({
      answerdPage: state => state.student.answerdPage,
      currentPageIndex: state => state.student.currentPageIndex,
    }),
    currentAnswerd() {
      // console.log(this.answerdPage[this.currentPageIndex])
      return this.answerdPage[this.currentPageIndex]
    }
  },
  props: {
    totalPage: {
      type: Number,
      default: 0,
    },
    lastPage: {
      type: Function,
    },
    nextPage: {
      type: Function,
    },
    currentModel: {
      type: String,
      default: ClassRoomModelEnum.TEACHER_MODEL,
    },
    unread: {
      type: Boolean,
      default: false,
    },
    showStudentModal: {
      type: Function,
    },
    fullScreenWidth: {
      type: Number,
      default: 0,
    },
    screenWidth: {
      type: Number,
      default: 900,
    },
    isShowQuestion: {
      type: Boolean,
      default: true,
    },
    changeShowOrAnswer: {
      type: Function,
    },
    smallWindow: {
      type: Boolean,
      default: false,
    },
    changeShowMetrial: {
      type: Function,
    },
  },
  watch: {
    meterialSwitchVisiable() {
      // EventBus.$emit(ModalEventsNameEnum.MEDIA_MODAL_VISIBLE, this.meterialVisiable)
      this.changeShowMetrial(this.meterialSwitchVisiable)
    }
  },
  data() {
    return {
      questionVisiable: false,
      meterialSwitchVisiable: false,
      dashTipsModalVisiable: false
    };
  },
  methods: {
    changeMeterial() {
      this.meterialSwitchVisiable = !this.meterialSwitchVisiable
    },
    showDashTips() {
      this.dashTipsModalVisiable = !this.dashTipsModalVisiable
    }
  }
};
</script>

<style scoped>
.question_area {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 150px;
  background-color: cadetblue;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
}
.arrow_opts {
  display: flex;
  width: auto;
  height: 100%;
}
.panel {
  display: flex;
  justify-content: start;
  width: 100%;
  height: 100%;
}
.svg_right {
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
}

.control-bar__button,
.control-bar__button--large,
.control-bar__button--lock {
  display: block;
  position: relative;
  height: auto;
  padding: 0.5em;
  background-color: transparent;
  border: 0px solid transparent;
  opacity: 1;
  text-align: center;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
  cursor: pointer;
}
.control-bar__icon,
.control-bar__icon--flip {
  display: inline-block;
  position: relative;
  vertical-align: middle;
  width: 0.9em;
  height: auto;
  fill: #ffffff;
}

.control-bar__icon:hover {
  fill: #c0c0c0;
}

.control-bar__button--large {
  min-width: 4.375em;
  min-height: 60px;
}

.control-bar__label {
  position: relative;
  display: none;
  font-size: 13px;
  color: #ffffff;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.25s ease;
  transition: all 0.25s ease;
}
.icon {
  fill: #ffffff;
  cursor: pointer;
}
.icon:hover {
  fill: antiquewhite;
}
.icon_left {
  margin-left: 20px;
}
.pageIndex {
  color: white;
  font-size: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}

.checkboxs {
  height: 100%;
  display: flex;
  align-items: center;
}

.info_area {
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
}
.readchatouter{
  width: 24px;
  height: 24px;
  margin: 13px 25px;
  position: relative;
  cursor: pointer;
}
.readchat {
  width: 24px;
  height: 24px;
}
.unread{
  width: 12px;
  height: 12px;
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #FF1A0E;
  border: 2px solid #fff;
  border-radius: 6px;
  box-sizing: border-box;
}
.aligncenter{
  display: flex;
  align-items: center;
}
.comment {
  background: #fff;
  height: 40px;
  padding: 0 5px;
  margin-top: 5px;
  border-radius: 4px;
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
.me-show{
  background-image:url(../../assets/picture/m-show.png)
}
.me-hide{
  background-image:url(../../assets/picture/m-hide.png)
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

.button_grey {
  background-color: #cfcfcf;
}
.back_focus {
  background-color: #fff;
  border-radius: 8px;
}
.button_text {
  line-height: 20px;
  font-size: 14px;
}
.dash-tip{
  background-image: url(../../assets/picture/dash-tip.png);
}
</style>