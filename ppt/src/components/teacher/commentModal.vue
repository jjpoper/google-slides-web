<template>
  <div class="tffixModal" v-if="modalVisiable">
    <div class="tfcommentModal">
      <div class="tfheader">
        <p class="tftitle">Feedback for {{commentData.sname}}</p>
        <img
          src="../../assets/picture/closecom.png"
          class="tfclose" 
          @click="closeModal"
        />
      </div>
      <div class="tfmbox" v-if="commentData.pageId">
        <div class="tfleft">
          <teacher-res :item="commentData" :userData="commentData" />
          <div v-if="(commentList && commentList.length > 0) && !addmore" class="tffooter-button-more"
            @click="addmoreFeed">
            <p class="tfmore-feed">Add More Feedback</p>
            <img src="../../assets/picture/send.png" class="tfmore-icon"/>
          </div>
          <div class="tfedit-area tfshadow" v-else>
            <div class="tftextarea-box">
              <textarea
                class="tftextarea"
                v-model="commentValue"
                placeholder=""
                @focus="focus"
                @blur="blur"
              ></textarea>
              <div class="tftext-placeholder" v-show="showPlaceholder">
                Leave feedback for this response……
              </div>
            </div>
            <div class="tffooter-button" @click="sendMessage">
              <div :class="`tfsend-button ${!showPlaceholder && 'tfactive'}`">Send Feedback</div>
            </div>
          </div>
        </div>
        <div class="tfright" v-if="commentList && commentList.length > 0">
          <teacher-res
            v-for="(item, index) in commentList"
            :item="item"
            :userData="commentData"
            :key="index.toString()">
            <div class="tffeed-item feed-media" v-if="item.commentType === 'video'">
              <video preload="meta" controls="false" :src="item.title" style="width:100%;" />
            </div>
            <div class="tffeed-item feed-media feed-media-audio" v-else-if="item.commentType === 'audio'">
              <audio-player :url="item.title"/>
            </div>
            <div v-else class="tffeed-item feed-text">
              {{ item.value }}
            </div>
          </teacher-res>
          <div class="tftransformmask"></div>
        </div>
        <div v-else class="tfempty">
          <img src="../../assets/picture/empty-feed.png" class="tfempty-img"/>
          <p class="tftitle">No Feedback Yet</p>
          <p class="tfempty-tip">Go to add your first reply</p>
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
import RecordVideo from "../common/recordVideo.vue";
import TeacherRes from './comment/TeacherRes.vue';
import AudioPlayer from '../common/audioPlayer.vue';
// import
export default {
  components: { base64image, RecordVideo, TeacherRes, AudioPlayer },
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
      textFocus: false,
      addmore: false
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
      ({ pageId, itemId, title, studentId, type, name, answertime }) => {
        // 通知展示当前pageid，当前itemid的评论框
        this.showModal({ pageId, itemId, title, studentId, type, name, answertime });
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
    showModal({ pageId, itemId, title, studentId, type, name, answertime }) {
      this.commentData = {
        title,
        pageId,
        itemId,
        studentId,
        type,
        sname: name,
        answertime
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
      // console.log(getTeacherUserName());
      const data = {
        time: `${month}/${date}/${year} ${hours}:${minutes}`, // 3/26/21 2:11
        value,
        commentType,
        teacherName: getTeacherUserName()
      };
      const { pageId, itemId, studentId, title, answertime } = this.commentData;
      addTeacherComment({
        studentId,
        pageId,
        itemId,
        title,
        answertime,
        ...data
      });
      this.commentList.unshift({
        ...this.commentData,
        ...data,
      });
      // console.log(this.commentList)
      EventBus.$emit(ModalEventsNameEnum.TEACHER_SEND_COMMENT, {
        studentId,
        pageId,
        itemId,
        title,
        answertime,
        ...data
      });
      this.addmore = false
    },
    addmoreFeed() {
      this.addmore = true
    },
    sendVideoOrAudio(url, type = "text") {
      this.sendComment(url, type);
    }
  }
};
</script>
<style scoped>
@import url(../../assets/css/teacherfeed.css);
</style>
