<template>
  <div class="answer-footer" v-if="data">
    <div class="emoji_area">
      <!-- <div class="user_icon">
        {{ data ? data.name.substr(0, 1) : " " }}
      </div> -->
      <span>{{ data ? data.name : " " }}</span>
    </div>
    <div class="opt_area">
      <el-tooltip
        :class="data.isShowRes ? 'item' : 'item hide'"
        effect="dark"
        content="Star Answer"
        placement="top-start"
      >
        <i @click="starAnswer"
          :class="`answer-footer-button ${data.isStar ? 'star' : 'unstar'}`"></i>
      </el-tooltip>
<!-- 
      <el-tooltip class="item" effect="dark" content="Audio" placement="top-start">
        <svg @click="audio" t="1622676486182" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1217" width="20" height="20"><path d="M566.215111 899.811556v118.158222h-85.333333v-114.915556C294.4 888.718222 147.342222 735.573333 147.342222 562.688a42.666667 42.666667 0 0 1 85.333334 0c0 134.257778 123.790222 256.113778 276.764444 256.113778s276.707556-121.912889 276.707556-256.113778a42.666667 42.666667 0 1 1 85.333333 0c0 164.067556-132.380444 310.385778-305.265778 337.123556zM510.976 33.336889a170.666667 170.666667 0 0 1 170.666667 170.666667v341.333333a170.666667 170.666667 0 1 1-341.333334 0v-341.333333a170.666667 170.666667 0 0 1 170.666667-170.666667z" fill="#1296db" p-id="1218"></path></svg>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="Video" placement="top-start">
        <svg @click="video" t="1622676554377" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2348" width="20" height="20"><path d="M768 648.533333V768H128V256h640v119.466667L896 298.666667v426.666666l-128-76.8z m0-93.866666l42.666667 25.6v-136.533334l-42.666667 25.6v85.333334zM213.333333 341.333333v341.333334h469.333334V341.333333H213.333333z" fill="#1296db" p-id="2349"></path></svg>
      </el-tooltip> -->

      <el-tooltip class="item" effect="dark" content="Feedback" placement="top-start">
        <i @click="comment"
          :class="`answer-footer-button unmessage`"></i>
      </el-tooltip>

      <el-popover placement="top-start" width="100" trigger="hover">
        <div
          class="response_opt"
          @click="hideResponse()"
        >{{ data.isShowRes ? "Hide" : "Show" }} Response</div>
        <!-- <svg
          slot="reference"
          t="1620960073835"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="10081"
          :width="size"
          :height="size"
        >
          <path
            d="M365.066 197.39c0 0 0 0 0 0 0 58.569 47.479 106.048 106.048 106.048 58.569 0 106.048-47.479 106.048-106.048 0 0 0 0 0 0 0-58.569-47.479-106.048-106.048-106.048-58.569 0-106.048 47.479-106.048 106.048 0 0 0 0 0 0z"
            fill="#1296db"
            p-id="10082"
          />
          <path
            d="M365.066 512c0 0 0 0 0 0 0 58.569 47.479 106.048 106.048 106.048 58.569 0 106.048-47.479 106.048-106.048 0 0 0 0 0 0 0-58.569-47.479-106.048-106.048-106.048-58.569 0-106.048 47.479-106.048 106.048 0 0 0 0 0 0z"
            fill="#1296db"
            p-id="10083"
          />
          <path
            d="M365.066 826.61c0 0 0 0 0 0 0 58.569 47.479 106.048 106.048 106.048 58.569 0 106.048-47.479 106.048-106.048 0 0 0 0 0 0 0-58.569-47.479-106.048-106.048-106.048-58.569 0-106.048 47.479-106.048 106.048 0 0 0 0 0 0z"
            fill="#1296db"
            p-id="10084"
          />
        </svg> -->
        <i slot="reference" class="answer-footer-button pop"></i>
      </el-popover>
    </div>
  </div>
</template>


<style scoped>
.answer-footer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 9px;
}
.emoji_area {
  height: 52px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 52px;
  color: #15C39A;
  display: flex;
}
.user_icon{
  width: 52px;
  height: 52px;
  border-radius: 26px;
  background-color: red;
  overflow: hidden;
  line-height: 52px;
  text-align: center;
  margin-left: 5px;
}
.user_info {
  height: auto;
  color: #1296db;
  font-size: 15px;
  flex: 1;
  display: flex;
  justify-content: flex-start;
  margin-left: 15px;
}
.hide {
  visibility: hidden;
}

.opt_area {
  display: flex;
  height: 100%;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
}
.response_opt {
  display: flex;
  height: 20px;
  width: 100%;
  color: #1296db;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.answer-footer-button {
  cursor: pointer;
  width: 20px;
  height: 20px;
  background-position: 0 0;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  display: block;
}
.answer-footer-button.star{
  background-image: url(../../assets/picture/started.png);
  margin-right: 16px;
}
.answer-footer-button.unstar{
  background-image: url(../../assets/picture/unstar.png);
  margin-right: 16px;
}
.answer-footer-button.message{
  background-image: url(../../assets/picture/message-selected.png);
}
.answer-footer-button.unmessage{
  background-image: url(../../assets/picture/message.png);
}
.answer-footer-button.pop{
  background-image: url(../../assets/picture/pop-icon.png);
  background-size: 4px 20px;
  background-position: 16px 0;
  width: 20px;
}
.video{
  width: 200px;
  height: 100px;
  position: fixed;
  top:100px;
  left: 300px;
  z-index: 999;
}
</style>

<script>
import { ModalEventsNameEnum, ModalEventsTypeEnum } from "@/socket/socketEvents";
import {startVideo} from '@/utils/video'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },

  data() {
    return {
      //   isStar: false,
      //   isShowRes: true,
      size: 20,
    };
  },
  methods: {
    starAnswer() {
      const { pageId, itemId, studentId, title, isStar } = this.data;
      const nextStatus = !isStar;
      const type = "star";
      // console.log("星标", this.data);
      EventBus.$emit(ModalEventsNameEnum.SHOW_STAR_ANSWER, {
        pageId,
        itemId,
        title,
        studentId,
        nextStatus,
        type
      });
    },
    comment() {
      // console.log("回复");
      this.showComment(ModalEventsTypeEnum.TEXT)
    },
    showComment(type) {
      const { pageId, itemId, studentId, title, name, answertime } = this.data;
      // console.log(answertime)
      EventBus.$emit(ModalEventsNameEnum.TEACHER_COMMENT_MODAL, {
        pageId,
        itemId,
        title,
        studentId,
        type,
        name,
        answertime
      });
    },
    hideResponse() {
      // console.log("隐藏");
      const { pageId, itemId, studentId, title, isShowRes } = this.data;
      const nextStatus = !isShowRes;
      const type = "show";
      EventBus.$emit(ModalEventsNameEnum.SHOW_STAR_ANSWER, {
        pageId,
        itemId,
        title,
        studentId,
        nextStatus,
        type
      });
    },
    video() {
      this.showComment(ModalEventsTypeEnum.VIDEO)
    },
    audio() {
      this.showComment(ModalEventsTypeEnum.AUDIO)
    }
  }
};
</script>