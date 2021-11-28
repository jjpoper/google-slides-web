<template>
  <div :class="`remark-container ${disable && 't-pad'}`">
    <div class="remark-control" v-if="!disable">
      <el-tooltip content="Audio Comment" placement="top">
        <div
          @click="audio"
          class="remark-button-outer"
        >
          <img v-show="currentInputType === ModalEventsTypeEnum.AUDIO" src="../../assets/picture/voice-button.png" class="remark-button" />
          <img v-show="currentInputType !== ModalEventsTypeEnum.AUDIO" src="../../assets/picture/voice-button-gray.png" class="remark-button" />
        </div>
      </el-tooltip>
      <el-tooltip content="Video Comment" placement="top">
        <div
         @click="video"
         class="remark-button-outer"
        >
          <img v-show="currentInputType === ModalEventsTypeEnum.VIDEO" src="../../assets/picture/video.png" class="remark-button" />
          <img v-show="currentInputType !== ModalEventsTypeEnum.VIDEO" src="../../assets/picture/video-gray.png" class="remark-button" />
        </div>
      </el-tooltip>
      <el-tooltip content="Text Comment" placement="top">
        <div
          @click="text"
          class="remark-button-outer"
        >
          <img v-show="currentInputType === ModalEventsTypeEnum.TEXT" src="../../assets/picture/new-comment.png" class="remark-button" />
          <img v-show="currentInputType !== ModalEventsTypeEnum.TEXT" src="../../assets/picture/new-comment-gray.png" class="remark-button" />
        </div>
      </el-tooltip>
    </div>
    <!-- <tipShow /> -->
    <ul class="remark-list" ref="remarklist">
      <!--输入区域item-->
      <li v-if="isEditing" class="remark-list-item record-item active-item">
        <div class="item-header">
          <div class="user-info">
            <div class="user-icon">{{userInfo.name ? userInfo.name.substr(0, 1) : ''}}</div>
            <div>
              <p class="user-name" v-if="userInfo.name">{{userInfo.name}}</p>
            </div>
          </div>
          <div @click.stop="cancelRecord" class="delete-button"></div>
        </div>
        <div class="remark-item-content">
          <record-video
            v-if="currentInputType === ModalEventsTypeEnum.VIDEO"
            :onSend="sendCommentCb"
            :cancel="cancelRecord"
            :isAniInFixed="false"
          />
          <record-audio
            v-else-if="currentInputType === ModalEventsTypeEnum.AUDIO"
            :onSend="sendCommentCb"
            :cancel="cancelRecord"
            :onRecordDone="onRecordDone"
            :isAniInFixed="false"
          />
          <record-text
            v-else-if="currentInputType === ModalEventsTypeEnum.TEXT"
            :onSend="sendCommentCb"
            :cancel="cancelRecord"
          />
        </div>
      </li>
      <li
        v-for="(item, index) in marks"
        :class="`remark-list-item ${item.type === 'text' && 'text-item'} ${currentRemarkIndex === index && 'active-item'} ${(isEditing || (currentRemarkIndex >= 0 && currentRemarkIndex !== index)) ? 'remark-list-item-gray' : ''}`"
        :key="item.id"
        :ref="currentRemarkIndex === index ? 'activeRef': ''"
        :tabindex="currentRemarkIndex === index ? '0' : ''"
        @click="changeRemarkIndex(index)"
      >
        <div class="item-header">
          <div class="user-info">
            <div
              class="user-icon"
              v-if="userInfo.name"
            >{{userInfo.name ? userInfo.name.substr(0, 1) : ''}}</div>
            <div>
              <p class="user-name" v-if="userInfo.name">{{userInfo.name}}</p>
              <p class="user-name user-time">{{getTimeStr(item.time)}}</p>
            </div>
          </div>
          <div v-if="item.id" @click.stop="deleteItem(item.id)" class="delete-button"></div>
        </div>
        <div class="remark-item-content">
          <video
            v-if="item.type === 'video'"
            controlslist="nodownload"
            controls
            :src="item.link"
            width="280"
            height="150"
            preload="auto"
          />
          <audio-player v-else-if="item.type === 'audio'" :url="item.link"/>
          <div @click.stop v-else-if="item.type === 'text'">
            <remark-text :item="item" :index="index"/>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { ModalEventsTypeEnum } from "@/socket/socketEvents";
import { mapActions, mapState } from "vuex";
import {
  deleteOneRemark,
  askToAddNewRemarkItem
} from "@/socket/socket.student";
import RecordAudio from "../common/recordAudio.vue";
import RecordVideo from "../common/recordVideo.vue";
import RecordText from '../common/recordText.vue';
import { showToast } from '@/utils/loading';
import AudioPlayer from '../common/audioPlayer.vue';
import tipShow from "./tipShow.vue";
import RemarkText from './remarkTextComp.vue';
export default {
  props: {
    disable: {
      type: Boolean,
      default: false
    }
  },
  components:{
    RecordVideo, RecordAudio, RecordText,
    AudioPlayer,tipShow,
    RemarkText
  },
  computed: {
    ...mapState({
      // currentReamrkList: state => state.remark.currentReamrkList,
      allRemarks: state => state.remark.allRemarks,
      currentRemarkIndex: state => state.remark.currentRemarkIndex,
      currentInputType: state => state.remark.currentInputType,
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
      currentRemarkOptions: state => state.remark.currentRemarkOptions,
      userInfo: state => state.student.studentUserInfo
    }),
    marks() {
      let list = [];
      if (this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      console.log('currentRemarkIndex', list)
      return list.reverse();
    },
    currentPageId() {
      return this.studentAllSlides[this.currentPageIndex].page_id;
    },
    isEditing() {
      return !this.disable && this.currentRemarkOptions
    }
  },
  watch: {
    currentRemarkIndex() {
      console.log('currentRemarkIndex', this.currentRemarkIndex)
      if(this.currentRemarkIndex > -1) {
        this.focusIndex()
      }
      this.$forceUpdate()
    },
    currentRemarkOptions() {
      this.$refs.remarklist.scrollTop = 0
    }
  },
  created() {
    this.setIsRemark(true);
    this.changeRemarkIndex(-1);
    this.setIsInputing(false);
    this.text();
  },
  destroyed() {
    this.setIsRemark(false);
  },
  data() {
    return {
      ModalEventsTypeEnum
    };
  },
  methods: {
    ...mapActions("remark", [
      "changeRemarkInputType",
      "changeRemarkIndex",
      "deleteOneRemarkItem",
      "setIsRemark",
      "setIsInputing",
      "setCurrentRemarkOptions",
      "addOneRemarkItem"
    ]),
    ...mapActions("student", ["updateAnswerdPage"]),
    focusIndex() {
      this.$nextTick(() => {
        if (this.$refs.activeRef && this.$refs.activeRef[0]) {
          this.$refs.activeRef[0].focus();
        }
      });
    },
    onRecordDone() {
      this.$refs.remarklist.scrollTop = 0
    },
    audio() {
      this.changeRemarkInputType(ModalEventsTypeEnum.AUDIO);
    },
    video() {
      this.changeRemarkInputType(ModalEventsTypeEnum.VIDEO);
    },
    text() {
      this.changeRemarkInputType(ModalEventsTypeEnum.TEXT);
    },
    deleteItem(id) {
      deleteOneRemark(id);
      const index = this.allRemarks.findIndex(item => item.id == id);
      this.deleteOneRemarkItem(index);
      if (index === this.currentRemarkIndex) {
        this.changeRemarkIndex(-1);
      }
    },
    getTimeStr(time) {
      var now = new Date();
      now.setTime(time * 1000);
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      if (second < 10) {
        second = "0" + second;
      }
      return (
        year +
        "-" +
        month +
        "-" +
        date +
        " " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
    cancelRecord() {
      console.log('cancelRecord')
      this.changeRemarkIndex(-1);
      this.setCurrentRemarkOptions(null);
    },
    sendCommentCb(link, type = "") {
      // this.sendComment(url, type)
      const {
        left,
        top,
        content_width,
        content_height,
        background,
        width,
        height,
        pointType
      } = this.currentRemarkOptions;
      const params = {
        left,
        top,
        link, // 可能为链接或者文字
        content_width,
        content_height,
        type,
        background,
        page_id: this.currentPageId,
        time: Math.floor(Date.now() / 1000),
        width,
        height,
        pointType,
        id: -1
      };
      askToAddNewRemarkItem(params);
      // TODO 增加页面展示
      
      this.addOneRemarkItem(params);
      showToast("send success");
      this.cancelRecord();
      this.updateAnswerdPage(this.currentPageIndex);
    },
  }
};
</script>
<style scoped>
.remark-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  /* padding-top: 100px; */
  box-sizing: border-box;
  background-color: rgba(211, 220, 230, 1);
  display: flex;
  flex-direction: column;
}
.remark-container.t-pad {
  padding-top: 5px;
}
.remark-control {
  width: 310px;
  height: 70px;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 20px 0 29px;
  /* position: absolute; */
  margin-top: 20px;
  margin-left: 20px;
}
.control-left {
  display: flex;
}
.remark-button-outer {
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  padding: 10px;
}
.remark-button-outer.active {
  background: rgba(21, 195, 154, 0.1);
  border: 1px solid #15c39a;
  opacity: 1;
  border-radius: 4px;
}
.remark-button {
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.remark-add-button {
  width: 31px;
  height: 31px;
  cursor: pointer;
}
.delete-button {
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-image: url(../../assets/picture/delete.png);
  background-size: 16px 16px;
  background-position: 9px 9px;
  background-repeat: no-repeat;
  cursor: pointer;
}
.delete-button:hover {
  background-color: tomato;
}
.remark-list {
  padding: 20px;
  width: 350px;
  flex: 1;
  
  overflow: scroll;
  box-sizing: border-box;
}
.remark-list-item {
  width: 310px;
  height: auto;
  background: #ffffff;
  box-shadow: 0px 3px 6px rgba(214, 214, 214, 1);
  opacity: 1;
  border-radius: 6px;
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
.remark-list-item.record-item {
  height: auto;
}
.remark-list-item.text-item {
  max-height: 180px;
}
.remark-list-item.active-item {
  /* box-shadow: 0px 3px 6px #15c39a; */
  border: 2px solid red
}
.remark-list-item.remark-list-item-gray{
  opacity: 0.4;
}
.item-header {
  width: 310px;
  min-height: 45px;
  background: rgba(21, 195, 154, 1);
  opacity: 1;
  border-radius: 6px 6px 0px 0px;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 18px;
}
.user-info {
  display: flex;
  align-items: center;
}
.user-icon {
  width: 34px;
  height: 34px;
  border-radius: 17px;
  margin-right: 11px;
  background-color: #eee;
  line-height: 34px;
  text-align: center;
  font-size: 20px;
  font-family: Inter-Bold;
}
.user-name {
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 19px;
  color: #ffffff;
  opacity: 1;
  text-align: left;
}
.user-time {
  font-size: 10px;
  line-height: 14px;
}
.remark-item-content {
  width: 310px;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 15px 15px 0;
  margin-bottom: 15px;
  flex: 1;
  word-break: break-all;
}
.remark-text {
  font-size: 10px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  text-align: justify;
}
video {
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
}
</style>