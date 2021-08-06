<template>
  <div class="fixModal" v-if="modalVisiable">
    <div class="commentModal">
      <div class="header">
        <p class="title">Feedback for Shen Apple</p>
        <img
          src="../../assets/picture/closecom.png"
          class="close" 
          @click="closeModal"
        />
      </div>
      <div class="mbox" v-if="commentData.pageId">
        <div class="left">
          <div class="mtitle" v-if="commentData.title.indexOf('data:image/') > -1">
            <base64image :url="commentData.title" />
          </div>

          <div class="mtitle" v-else-if="commentData.title.indexOf('.mp3') > -1">
            <audio preload="none" controlslist="nodownload" controls :src="commentData.title" style="width:100%;" />
          </div>

          <div class="mtitle" v-else-if="commentData.title.indexOf('.webm') > -1">
            <video preload="none" controlslist="nodownload" controls :src="commentData.title" style="width:100%;" />
          </div>

          <div class="rightmtitle" v-else-if="commentData.title.indexOf('[') > -1">
            <div v-for="(text, index) in getAnswer(commentData.title)" :key="index">{{ text }}</div>
          </div>
          <div class="rightmtitle" v-else>{{commentData.title}}</div>
          <template v-if="commentData.type === ModalEventsTypeEnum.TEXT">
            <div>
              <textarea
                class="textarea"
                v-model="commentValue"
                placeholder="Leave a message for this response..."
              ></textarea>
              <el-button type="primary" style="width: 100%" @click="sendMessage">send</el-button>
            </div>
          </template>
          <template v-else-if="commentData.type === ModalEventsTypeEnum.VIDEO">
            <record-video :onSend="sendVideoOrAudio" />
          </template>
          <template v-else-if="commentData.type === ModalEventsTypeEnum.AUDIO">
            <record-audio :onSend="sendVideoOrAudio" />
          </template>
        </div>
        <div class="right" v-if="commentList && commentList.length > 0">
          <div v-for="(item, index) in commentList" :key="index.toString()">
            <div class="rightmtitle" v-if="commentData.title.indexOf('data:image/') > -1">
              <base64image :url="commentData.title" />
            </div>
            <div class="rightmtitle" v-else-if="commentData.title.indexOf('.mp3') > -1">
              <audio
                controlslist="nodownload"
                controls
                :src="commentData.title"
                style="width:100%;"
              />
            </div>

            <div class="rightmtitle" v-else-if="commentData.title.indexOf('.webm') > -1">
              <video
                controlslist="nodownload"
                controls
                :src="commentData.title"
                style="width:100%;"
              />
            </div>
            <div class="rightmtitle" v-else-if="commentData.title.indexOf('[') > -1">
              <p v-for="(text, index) in getAnswer(commentData.title)" :key="index">{{ text }}</p>
            </div>
            <div class="rightmtitle" v-else>{{ commentData.title }}</div>
            <div class="rightcomment">
              <p>{{ item.teacherName }} {{ item.time }}</p>
              <video
                v-if="item.commentType === 'video'"
                controlslist="nodownload"
                controls
                :src="item.value"
                style="width:60%;"
              />
              <audio
                v-else-if="item.commentType === 'audio'"
                controlslist="nodownload"
                controls
                :src="item.value"
                style="width:60%;"
              />
              <p v-else>{{ item.value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.fixModal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 99999999;
}
.commentModal {
  width: 1000px;
  height: 822px;
  position: relative;
  top: 50%;
  left: 50%;
  margin-left: -500px;
  margin-top: -411px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  /* transform: scale(0.8); */
}
.header {
  height: 95px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 34px;
  padding-right: 24px;
  border-bottom:1px solid #D8D8D8;
  box-sizing: border-box;
}
.title{
  font-size: 20px;
  font-family: Inter-Bold;
  color: #000000;
  opacity: 1;
}
.close {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.mbox {
  height: 525px;
  width: 100%;
  text-align: left;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.left {
  width: 300px;
  height: 525px;
  /* border: 1px solid #999; */
}
.mtitle {
  background-color: #f2f2f2;
  width: 100%;
  height: auto;
  min-height: 100px;
  max-height: 250px;
  overflow: hidden;
  border: 1px solid #999;
  box-sizing: border-box;
  padding: 20px;
  word-wrap: break-word;
  position: relative;
}
.textarea {
  background-color: #fff;
  width: 100%;
  height: 120px;
  border: 1px solid #999;
  /* border: none; */
}
.right {
  width: 100%;
  height: 525px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.rightmtitle {
  width: 100%;
  min-height: 70px;
  overflow: hidden;
  background-color: #f2f2f2;
  border: 1px solid #999;
  box-sizing: border-box;
  padding: 10px;
  word-wrap: break-word;
  position: relative;
}
.rightcomment {
  min-height: 70px;
  background-color: #fff;
  width: 100%;
  border: 1px solid #999;
  margin-bottom: 10px;
  box-sizing: border-box;
}
</style>
<script>
import {
  ModalEventsNameEnum,
  ModalEventsTypeEnum
} from "@/socket/socketEvents";
import {
  getTeacherUserName,
  addTeacherComment,
  getTeacherCommentList
} from "@/model/store.teacher";
import { getTimeValue } from "@/utils/help";
import base64image from "../base64image.vue";
import RecordAudio from "../common/recordAudio.vue";
import RecordVideo from "../common/recordVideo.vue";
// import
export default {
  components: { base64image, RecordAudio, RecordVideo },
  data() {
    return {
      commentValue: "",
      modalVisiable: false,
      commentData: {
        title: "1",
        pageId: "1",
        itemId: "1",
        studentId: "1",
        type: "text"
      },
      ModalEventsTypeEnum,
      isRecording: false,
      endRecording: false,
      commentList: [] // {time: '',value: ''}
    };
  },
  mounted() {
    EventBus.$on(
      ModalEventsNameEnum.TEACHER_COMMENT_MODAL,
      ({ pageId, itemId, title, studentId, type }) => {
        // 通知展示当前pageid，当前itemid的评论框
        this.showModal({ pageId, itemId, title, studentId, type });
      }
    );
  },
  methods: {
    showModal({ pageId, itemId, title, studentId, type }) {
      this.commentData = {
        title,
        pageId,
        itemId,
        studentId,
        type
      };
      this.commentList = getTeacherCommentList({ pageId, itemId, studentId });
      this.modalVisiable = true;
    },
    closeModal() {
      this.modalVisiable = false;
      this.commentList = [];
    },
    getAnswer(answer) {
      console.log(JSON.parse(answer));
      return JSON.parse(answer);
    },
    sendMessage() {
      if (!this.commentValue) {
        this.$message.warning("Please input your comment");
        return;
      }
      this.sendComment(this.commentValue, "text");
      this.commentValue = "";
    },
    sendComment(value, commentType = "text") {
      const { year, hours, month, date, minutes } = getTimeValue(Date.now());
      console.log(getTeacherUserName());
      const data = {
        time: `${month}/${date}/${year} ${hours}:${minutes}`, // 3/26/21 2:11
        value,
        commentType,
        teacherName: getTeacherUserName()
      };
      const { pageId, itemId, studentId, title } = this.commentData;
      addTeacherComment({
        studentId,
        pageId,
        itemId,
        title,
        ...data
      });
      this.commentList.unshift(data);
      EventBus.$emit(ModalEventsNameEnum.TEACHER_SEND_COMMENT, {
        studentId,
        pageId,
        itemId,
        title,
        ...data
      });
    },
    sendVideoOrAudio(url, type = "text") {
      this.sendComment(url, type);
    }
  }
};
</script>
