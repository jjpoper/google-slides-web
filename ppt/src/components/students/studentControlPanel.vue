<template>
  <div class="panel">
    <div v-if="isStudentPaced" class="arrow_opts">
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
      <student-tips-modal />
    </div>
    <student-tips-modal v-else/>

    <div class="info_area">
      <div class="checkboxs">
        <el-checkbox :value="currentAnswerd" style="color: #fff">
          slide {{ parseInt(currentPageIndex) + 1 }}/{{ totalPage }}
        </el-checkbox>
      </div>
    </div>

    <div class="aligncenter" v-if="isStudentPaced && filterAddedMediaList.length > 0">
      <div
        :class="`button_area ${meterialVisiable ? 'back_focus' : ''}`"
        @click="changeMeterial"
      >
        <div class="meterialimage">
          <div :class="`fullbgimg ${meterialVisiable ? 'me-show' : 'me-hide'}`"></div>
          <i class="metarialnums">{{filterAddedMediaList.length}}</i>
        </div>
        <strong class="button_text">{{meterialVisiable ? 'Material hiding' : 'Display material'}}</strong>
      </div>
    </div>
    <div class="readchatouter" 
        @click="showStudentModal" v-if="currentFeedList && currentFeedList.length > 0">
      <img
        src="../../assets/picture/liaotian_icon.png"
        class="readchat"
      />
      <i :class="`${isUnread && 'unread'}`"></i>
    </div> 
    <div class="question_area" v-if="smallWindow" @click="changeShowOrAnswer()">
      {{ isShowQuestion ? "Answer " : "Show " }}Question
    </div>
  </div>
</template>
<script>
import { ClassRoomModelEnum } from "../../socket/socketEvents";
import {mapState, mapGetters} from 'vuex'
import StudentTipsModal from './studentTipsModal.vue';
export default {
  components: { StudentTipsModal },
  computed: {
    ...mapState({
      answerdPage: state => state.student.answerdPage,
      currentPageIndex: state => state.student.currentPageIndex,
      studentFeedBackComments: state => state.student.studentFeedBackComments,
      unreadStudentCommentIds: state => state.student.unreadStudentCommentIds,
    }),
    ...mapGetters({
      currentPageId: 'student/currentPageId',
      currentFeedList: 'student/currentFeedList',
    }),
    currentAnswerd() {
      // console.log(this.answerdPage[this.currentPageIndex])
      return this.answerdPage[this.currentPageIndex]
    },
    isUnread() {
      let status = false
      for(let i = 0; i < this.currentFeedList.length; i++) {
        const {id} = this.currentFeedList[i]
        if(this.unreadStudentCommentIds.indexOf(id) > -1) {
          status = true
          break
        }
      }
      return status
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
    isStudentPaced: {
      type: Boolean,
      default: false
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
    meterialVisiable: {
      type: Boolean,
      default: false,
    },
    filterAddedMediaList: {
      type: Array,
      function() {
        return [];
      },
    },
  },
  data() {
    return {
      questionVisiable: false,
    };
  },
  methods: {
    changeMeterial() {
      this.changeShowMetrial(!this.meterialVisiable)
    },
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
  fill: #000000;
}

.control-bar__icon:hover {
  fill: #000000;
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
  color: #000;
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
  width: 20px;
  height: 20px;
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #FF1A0E;
  border: 2px solid #fff;
  border-radius: 10px;
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
  background-image:url(../../assets/picture/m-show.png);
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
  background-color: red;
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