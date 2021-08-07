<template>
  <div class="fixModal" v-if="modalVisiable">
    <div class="commentModal">
      <div class="header">
        <p class="title">Feedback for {{commentData.sname}}</p>
        <img
          src="../../assets/picture/closecom.png"
          class="close" 
          @click="closeModal"
        />
      </div>
      <div class="mbox" v-if="commentData.pageId">
        <div class="left">
          <teacher-res :item="commentData" :userData="commentData" />
          <div class="edit-area shadow">
            <div class="textarea-box">
              <textarea
                class="textarea"
                v-model="commentValue"
                placeholder=""
                @focus="focus"
                @blur="blur"
              ></textarea>
              <div class="text-placeholder" v-show="showPlaceholder">
                Lonve feedback for this response……
              </div>
            </div>
            <div class="footer-button">
              <div :class="`send-button ${!showPlaceholder && 'active'}`">Send Feedback</div>
            </div>
          </div>
          <!-- <template v-if="commentData.type === ModalEventsTypeEnum.TEXT">
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
          </template> -->
        </div>
        <div class="right" v-if="commentList && commentList.length > 0">
          <teacher-res
            v-for="(item, index) in commentList"
            :item="item"
            :userData="commentData"
            :key="index.toString()">
          </teacher-res>
          <div >
            <!-- <div class="rightcomment">
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
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
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
import TeacherRes from './comment/TeacherRes.vue';
// import
export default {
  components: { base64image, RecordAudio, RecordVideo, TeacherRes },
  data() {
    return {
      commentValue: "",
      modalVisiable: false,
      commentData: {
        title: "1",
        pageId: "1",
        itemId: "1",
        studentId: "1",
        type: "text",
        sname: ''
      },
      ModalEventsTypeEnum,
      isRecording: false,
      endRecording: false,
      commentList: [], // {time: '',value: ''}
      textFocus: false
    };
  },
  computed: {
    showPlaceholder() {
      return !this.commentValue
    }
  },
  mounted() {
    EventBus.$on(
      ModalEventsNameEnum.TEACHER_COMMENT_MODAL,
      ({ pageId, itemId, title, studentId, type, name }) => {
        // 通知展示当前pageid，当前itemid的评论框
        this.showModal({ pageId, itemId, title, studentId, type, name });
      }
    );
  },
  methods: {
    focus() {
      this.textFocus = true
    },
    blur() {
      this.textFocus = false
    },
    showModal({ pageId, itemId, title, studentId, type, name }) {
      this.commentData = {
        title,
        pageId,
        itemId,
        studentId,
        type,
        sname: name
      };
      this.commentList = getTeacherCommentList({ pageId, itemId, studentId });
      this.modalVisiable = true;
    },
    closeModal() {
      this.modalVisiable = false;
      this.commentList = [];
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
<style scoped>
*{box-sizing: border-box;}
.shadow{
  box-shadow: 0px 1px 3px 3px rgb(0 0 0 / 16%);
  border-radius: 8px;
}
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
  transform: scale(0.8);
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
  height: 729px;
  width: 100%;
  text-align: left;
  padding: 22px 55px 22px 32px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.textarea-box{
  width: 360px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #D8D8D8;
  opacity: 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}
.textarea {
  background-color: transparent;
  width: 360px;
  height: 120px;
  padding: 5px;
  border: none;
  box-sizing: border-box;
  outline: none;
  resize: none
}
.left{
  padding: 3px;
}
.right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  overflow-y: scroll;
  padding: 3px;
  box-sizing: border-box;
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
.nocontrols::-webkit-media-controls{ 
  display:none !important;
}
video{
  width: 100%; height: 100%; object-fit: cover
}
.edit-area{
  height: 220px;
  width: 402px;
  box-sizing: border-box;
  padding: 20px;
}
.text-placeholder{
  position: absolute;
  top: 50%;
  height: 22px;
  transform: translateY(-11px);
  left: 20px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #828282;
  padding-right: 30px;
  text-align: right;
  background-image: url(../../assets/picture/pencial.png);
  background-size: 22px 22px;
  background-position: bottom 0 right 0;
  background-repeat: no-repeat;
  pointer-events: none;
}
.footer-button{
  margin-top: 19px;
  height: 40px;
  display: flex;
  justify-content: center;
}
.send-button{
  width: 180px;
  height: 40px;
  border-radius: 20px;
  box-sizing: border-box;
  background-color: #F6F7F7;
  border: 1px solid #E5E5E5;
  line-height: 40px;
  font-size: 14px;
  font-family: Inter-Bold;
  color: #000000;
  padding-left: 27px;
  background-image: url(../../assets/picture/send-disable.png);
  background-size: 22px 18.33px;
  background-position: bottom 9px right 20px;
  background-repeat: no-repeat;
}
.send-button.active{
  background: #15C39A;
  color: #FFFFFF;
  background-image: url(../../assets/picture/send.png);
  background-size: 22px 18.33px;
  background-position: bottom 9px right 20px;
  background-repeat: no-repeat;
}
</style>
