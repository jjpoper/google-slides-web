<template>
  <div class="fixModal" v-if="modalVisiable">
    <div class="commentModal">
      <div class="header">
        Messages
        <div class="close" @click="closeModal">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="mbox" v-if="commentData.pageId">
        <div class="left">
          <div
            class="mtitle"
            v-if="commentData.title.indexOf('data:image/') > -1"
          >
            <base64image :url="commentData.title" />
          </div>
          <div
            class="rightmtitle"
            v-else-if="commentData.title.indexOf('[') > -1"
          >
            <div
              v-for="(text, index) in getAnswer(commentData.title)"
              :key="index"
            >
              {{ text }}
            </div>
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
            <div>
              <video class="textarea" id="record-video"/>
              <el-row>
                <el-tooltip content="start" placement="top" v-if="endRecording">
                  <el-button type="primary" icon="el-icon-video-play" @click="startRecord" circle></el-button>
                </el-tooltip>
                <el-tooltip content="resume" placement="top" v-if="!isRecording && !endRecording">
                  <el-button type="primary" icon="el-icon-video-play" @click="resumeVideo" circle></el-button>
                </el-tooltip>
                <el-tooltip content="pause" placement="top" v-else-if="isRecording && !endRecording">
                  <el-button type="primary" icon="el-icon-video-pause" @click="pauseVideo" circle></el-button>
                </el-tooltip>
                <!-- <el-tooltip content="resume" placement="top">
                  <el-button type="primary" icon="el-icon-refresh" @click="resume" circle></el-button>
                </el-tooltip> -->
                <el-button type="primary" @click="doneRecord">done</el-button>
              </el-row>
            </div> 
          </template>
        </div>
        <div class="right" v-if="commentList && commentList.length > 0">
          <div v-for="(item, index) in commentList" :key="index.toString()">
            <div
              class="rightmtitle"
              v-if="commentData.title.indexOf('data:image/') > -1"
            >
              <base64image :url="commentData.title" />
            </div>
            <div
              class="rightmtitle"
              v-else-if="commentData.title.indexOf('[') > -1"
            >
              <p
                v-for="(text, index) in getAnswer(commentData.title)"
                :key="index"
              >
                {{ text }}
              </p>
            </div>
            <div class="rightmtitle" v-else>{{ commentData.title }}</div>
            <div class="rightcomment">
              <p>{{ item.teacherName }} {{ item.time }}</p>
              <p>{{ item.value }}</p>
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
}
.commentModal {
  width: 600px;
  height: 360px;
  position: relative;
  top: 50%;
  left: 50%;
  margin-left: -300px;
  margin-top: -150px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.header {
  height: 70px;
  width: 100%;
  text-align: left;
  padding-left: 30px;
  line-height: 70px;
  box-sizing: border-box;
}
.close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
  font-size: 30px;
}
.mbox {
  height: 270px;
  width: 100%;
  text-align: left;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.left {
  width: 200px;
  height: 270px;
  /* border: 1px solid #999; */
}
.mtitle {
  background-color: #f2f2f2;
  width: 100%;
  height: 100px;
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
  width: 323px;
  height: 270px;
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
  width: 320px;
  border: 1px solid #999;
  margin-bottom: 10px;
}
</style>
<script>
import { ModalEventsNameEnum, ModalEventsTypeEnum } from "@/socket/socketEvents";
import {
  getTeacherUserName,
  addTeacherComment,
  getTeacherCommentList,
} from "@/model/store.teacher";
import { getTimeValue } from "@/utils/help";
import base64image from "../base64image.vue";
import {startRecordVideo, pauseRecordVideo, resumeRecordVideo, saveRecordVideo} from '@/utils/video'
export default {
  components: { base64image },
  data() {
    return {
      commentValue: "",
      modalVisiable: false,
      commentData: {
        title: "1",
        pageId: "1",
        itemId: "1",
        studentId: "1",
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
      if(type === ModalEventsTypeEnum.VIDEO) {
        this.$nextTick(() => {
          startRecordVideo(document.getElementById("record-video"))
          this.isRecording = true
        })
      }
    },
    closeModal() {
      this.modalVisiable = false;
      this.commentList = [];
      if(this.isRecording) {
        this.doneRecord()
      }
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
      const { year, hours, month, date, minutes } = getTimeValue(Date.now());
      console.log(getTeacherUserName());
      const data = {
        time: `${month}/${date}/${year} ${hours}:${minutes}`, // 3/26/21 2:11
        value: this.commentValue,
        teacherName: getTeacherUserName(),
      };
      const { pageId, itemId, studentId, title } = this.commentData;
      addTeacherComment({
        studentId,
        pageId,
        itemId,
        title,
        ...data,
      });
      this.commentList.unshift(data);
      this.commentValue = "";
      EventBus.$emit(ModalEventsNameEnum.TEACHER_SEND_COMMENT, {
        studentId,
        pageId,
        itemId,
        title,
        ...data,
      });
    },
    pauseVideo() {
      pauseRecordVideo()
      this.isRecording = false
    },
    resumeVideo() {
      resumeRecordVideo()
      this.isRecording = true
    },
    doneRecord() {
      saveRecordVideo()
      this.endRecording = true
      this.isRecording = false
    },
    startRecord() {
      startRecordVideo(document.getElementById("record-video"))
      this.isRecording = true
      this.endRecording = false
    }
  }
};
</script>
