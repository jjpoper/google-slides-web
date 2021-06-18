<template>
  <div class="panel">
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
        <div class="pageIndex">{{ currentPage }} of {{ totalPage }}</div>
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
          slide {{ currentPage }}/{{ totalPage }}
        </el-checkbox>
      </div>
    </div>
    <i
      class="el-icon-chat-dot-round readchat"
      @click="showStudentModal"
      :style="{ color: unread ? 'red' : '#fff' }"
    />
    <div class="question_area" v-if="smallWindow" @click="changeShowOrAnswer()">
      {{ isShowQuestion ? "Answer " : "Show " }}Question
    </div>
  </div>
</template>

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
  min-height: 50px;
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

.readchat {
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-right: 50px;
}
.comment {
  background: #fff;
  height: 40px;
  padding: 0 5px;
  margin-top: 5px;
  border-radius: 4px;
}
</style>
<script>
import { ClassRoomModelEnum } from "../../socket/socketEvents";
export default {
  props: {
    currentPage: {
      type: Number,
      default: 0,
    },
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
    currentAnswerd: {
      type: Boolean,
    },
    unread: {
      type: Boolean,
      default: false,
    },
    showStudentModal: {
      type: Function,
    },
    showStudentQuestions: {
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
  },
  data() {
    return {
      questionVisiable: false,
    };
  },
};
</script>