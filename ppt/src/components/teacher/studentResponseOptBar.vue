<template>
  <div class="answer-footer" v-if="data">
    <div class="emoji_area" :title="data.name">
      {{ data ? data.name.split("@")[0] : " " }}
    </div>
    <div class="opt_area" v-if="!isProject">
      <el-tooltip
        effect="dark"
        content="Star Answer"
        placement="top-start"
      >
        <i @click="starAnswer"
          :class="`answer-footer-button ${currentOptions.star ? 'star' : 'unstar'}`"></i>
      </el-tooltip>

      <el-tooltip class="item" effect="dark" content="Feedback" placement="top-start">
        <i @click="comment"
          :class="`answer-footer-button ${isCommented ? 'message' : 'unmessage'} `"></i>
      </el-tooltip>

      <el-popover placement="top-start" width="100" trigger="hover">
        <div
          class="response_opt"
          @click="hideResponse()"
        >{{ !currentOptions.show_response ? "Hide" : "Show" }} Response</div>
        <i slot="reference" class="answer-footer-button pop"></i>
      </el-popover>
    </div>
  </div>
</template>
<script>
import { ModalEventsNameEnum, ModalEventsTypeEnum } from "@/socket/socketEvents";
import {mapState, mapGetters, mapActions} from 'vuex'
import { sendTeacherSocketRequest } from '@/socket/socket.teacher';
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    ...mapState({
      feedBackAnswerIds: state => state.teacher.feedBackAnswerIds,
      allAnswerList: state => state.student.allAnswerList,
      allRemarks: state => state.remark.allRemarks
    }),
    ...mapGetters({
      currentPageAnswerType: 'student/currentPageAnswerType'
    }),
    isCommented() {
      const { id } = this.data;
      return id && this.feedBackAnswerIds[id]
    },
    currentOptions() {
      let list = []
      if(this.currentPageAnswerType === 'comment') {
         list = this.allRemarks
      } else {
        list = this.allAnswerList
      }
      const data = list.filter((item) => item.id == this.data.id)
      console.log(data)
      return data[0] || {}
    }
  },
  data() {
    return {
      //   isStar: false,
      //   isShowRes: true,
      size: 20,
      isProject: location.href.indexOf('/t/') > -1
    };
  },
  methods: {
    ...mapActions('student', ['updateAnswerStarOrResponse']),
    ...mapActions('remark', ['updateCommentStarOrResponse']),
    starAnswer() {
      const { id } = this.data;
      const {star} = this.currentOptions
      const nextStatus = star == 1 ? 0 : 1;
      console.log("星标", this.currentOptions, id);
      // EventBus.$emit(ModalEventsNameEnum.SHOW_STAR_ANSWER, {
      //   pageId,
      //   itemId,
      //   title,
      //   studentId,
      //   nextStatus,
      //   type,
      //   id
      // });
      sendTeacherSocketRequest('star', {
        star_type: nextStatus,   // 1：打星；0：取消打星
        response_id: id,
        type: this.currentPageAnswerType !== 'comment' ? 'response' : 'comment'
      })
      if(this.currentPageAnswerType !== 'comment') {
        // 非comment题型
        this.updateAnswerStarOrResponse({
          id,
          star: nextStatus
        })
      } else {
        this.updateCommentStarOrResponse({
          id,
          star: nextStatus
        })
      }
    },
    comment() {
      // console.log("回复");
      this.showComment(ModalEventsTypeEnum.TEXT)
    },
    showComment(type) {
      const { pageId, studentId, title, name, answertime, id } = this.data;
      // console.log(title, id, 'title 1')
      EventBus.$emit(ModalEventsNameEnum.TEACHER_COMMENT_MODAL, {
        pageId,
        title,
        studentId,
        type,
        name,
        answertime,
        id
      });
    },
    hideResponse() {
      // console.log("隐藏");
      const { id } = this.data;
      const {show_response} = this.currentOptions
      const nextStatus = show_response == 1 ? 0 : 1;
      // const type = "show";
      // EventBus.$emit(ModalEventsNameEnum.SHOW_STAR_ANSWER, {
      //   pageId,
      //   itemId,
      //   title,
      //   studentId,
      //   nextStatus,
      //   type
      // });
      // show_response
      sendTeacherSocketRequest('control-response', {
        show_type: nextStatus,   // 1：打星；0：取消打星
        response_id: id,
        type: this.currentPageAnswerType !== 'comment' ? 'response' : 'comment'
      })
       if(this.currentPageAnswerType !== 'comment') {
        // 非comment题型
        this.updateAnswerStarOrResponse({
          id,
          show_response: nextStatus
        })
      } else {
        this.updateCommentStarOrResponse({
          id,
          show_response: nextStatus
        })
      }
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


<style scoped>
.answer-footer {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  /* padding: 0 9px; */
}
.emoji_area {
  height: 52px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 52px;
  color: #15C39A;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: 80px;
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