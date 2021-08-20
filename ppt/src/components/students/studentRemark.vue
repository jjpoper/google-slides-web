<template>
  <div class="remark-container">
    <div class="remark-control">
      <el-tooltip content="Audio Comment" placement="top">
        <div :class="`remark-button-outer ${currentInputType === ModalEventsTypeEnum.AUDIO && 'active'}`">
          <img @click="audio" src="../../assets/picture/voice-button.png" class="remark-button"/>
        </div>
      </el-tooltip>
       <el-tooltip content="Video Comment" placement="top">
         <div :class="`remark-button-outer ${currentInputType === ModalEventsTypeEnum.VIDEO && 'active'}`">
          <img @click="video" src="../../assets/picture/video.png" class="remark-button"/>
         </div>
      </el-tooltip>
       <el-tooltip content="Text Comment" placement="top">
         <div :class="`remark-button-outer ${currentInputType === ModalEventsTypeEnum.TEXT && 'active'}`">
          <img @click="text" src="../../assets/picture/message-selected.png" class="remark-button"/>
         </div>
      </el-tooltip>
    </div>
    <ul class="remark-list">
      <!--输入区域item-->
      <li v-if="currentRemarkOptions" class="remark-list-item record-item active-item">
        <div class="item-header">
          <div class="user-info">
            <div class="user-icon">
              {{userInfo.name ? userInfo.name.substr(0, 1) : ''}}
            </div>
            <div>
              <p class="user-name" v-if="userInfo.name">{{userInfo.name}}</p>
            </div>
          </div>
          <div @click.stop="cancelRecord" class="delete-button"></div>
        </div>
        <div class="remark-item-content">
          <record-video v-if="currentInputType === ModalEventsTypeEnum.VIDEO" :onSend="sendCommentCb" />
          <record-audio v-else-if="currentInputType === ModalEventsTypeEnum.AUDIO" :onSend="sendCommentCb" />
          <record-text v-else-if="currentInputType === ModalEventsTypeEnum.TEXT" :onSend="sendCommentCb" />
        </div>
      </li>
      <li
        :class="`remark-list-item ${item.type === 'text' && 'text-item'} ${currentRemarkIndex === index && 'active-item'}`"
        v-for="(item, index) in marks" :key="index"
        :ref="currentRemarkIndex === index ? 'activeRef': ''"
        @click="changeRemarkIndex(index)">
        <div class="item-header">
          <div class="user-info">
            <div class="user-icon">
              {{userInfo.name ? userInfo.name.substr(0, 1) : ''}}
            </div>
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
            controls=""
            :src="item.link"
            width="280"
            height="150"
            preload="none"
          />
          <audio
            v-else-if="item.type === 'audio'"
            controlslist="nodownload"
            controls=""
            :src="item.link"
            style="width:100%;"
            preload="none"
          />
          <p class="remark-text" v-else-if="item.type === 'text'">
            {{item.link}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { ModalEventsTypeEnum } from '@/socket/socketEvents'
import {mapActions, mapState} from 'vuex'
import { deleteOneRemark, askToAddNewRemarkItem } from '@/socket/socket.student'
import RecordAudio from "../common/recordAudio.vue";
import RecordVideo from "../common/recordVideo.vue";
import RecordText from '../common/recordText.vue';
import { showToast } from '@/utils/loading';
export default {
  components:{
    RecordVideo, RecordAudio, RecordText
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
      userInfo: state => state.student.studentUserInfo,
    }),
    marks() {
      let list = []
      if(this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      return list;
    },
    currentPageId() {
      return this.studentAllSlides[this.currentPageIndex].page_id
    }
  },
  watch: {
    currentRemarkIndex() {
      if(this.currentRemarkIndex > -1) {
        this.$nextTick(() => {
          if(this.$refs.activeRef) {
            setTimeout(() => {
            console.log('===focus')
              this.$refs.activeRef[0].focus();
            }, 1000)
          }
        });
      }
    }
  },
  created() {
    this.setIsRemark(true)
    this.changeRemarkIndex(-1)
    this.setIsInputing(false)
    this.text()
  },
  destroyed() {
    this.setIsRemark(false)
  },
  data() {
    return {
      ModalEventsTypeEnum
    }
  },
  methods: {
    ...mapActions('remark', [
      'changeRemarkInputType',
      'changeRemarkIndex',
      'deleteOneRemarkItem',
      'setIsRemark',
      'setIsInputing',
      'setCurrentRemarkOptions',
      'addOneRemarkItem'
    ]),
    audio() {
      this.changeRemarkInputType(ModalEventsTypeEnum.AUDIO)
    },
    video() {
      this.changeRemarkInputType(ModalEventsTypeEnum.VIDEO)
    },
    text() {
      this.changeRemarkInputType(ModalEventsTypeEnum.TEXT)
    },
    deleteItem(id) {
      deleteOneRemark(id)
      const index = this.allRemarks.findIndex(item => item.id == id)
      this.deleteOneRemarkItem(index)
      if(index === this.currentRemarkIndex) {
        this.changeRemarkIndex(-1)
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
      this.setCurrentRemarkOptions(null)
    },
    sendCommentCb(link, type = "") {
      // this.sendComment(url, type)
      const { left, top, content_width, content_height, background, width, height, pointType} = this.currentRemarkOptions;
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
        width, height, pointType
      }
      askToAddNewRemarkItem(params)
      // TODO 增加页面展示
      this.changeRemarkIndex(this.allRemarks.length)
      this.addOneRemarkItem(params)
      showToast("send success");
      this.cancelRecord()
    },
  }
}
</script>
<style scoped>
.remark-container{
  position: relative;
  /* overflow: hidden; */
  width: 100%;
  height: 100%;
  padding-top: 100px;
  box-sizing: border-box;
}
.remark-control{
  width: 310px;
  height: 70px;
  background: #FFFFFF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  display: flex;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 20px 0 29px;
  position: absolute;
  top: 20px;
  left: 20px;
}
.control-left{
  display: flex;
}
.remark-button-outer{
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  padding: 10px;
}
.remark-button-outer.active{
  background: rgba(21, 195, 154, 0.1);
  border: 1px solid #15C39A;
  opacity: 1;
  border-radius: 4px;
}
.remark-button{
  width: 40px;
  height: 40px;
  cursor: pointer;
}
.remark-add-button{
  width: 31px;
  height: 31px;
  cursor: pointer;
}
.delete-button{
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-image: url(../../assets/picture/delete.png);
  background-size: 16px 16px;
  background-position: 9px 9px;
  background-repeat: no-repeat;
  cursor: pointer;
}
.delete-button:hover{background-color:tomato;}
.remark-list{
  padding: 20px;
  width: 350px;
  height: 100%;
  overflow: scroll;
  box-sizing: border-box;
}
.remark-list-item{
  width: 310px;
  height: auto;
  background: #FFFFFF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.remark-list-item.record-item{
  height: auto;
}
.remark-list-item.text-item{
  height: 180px;
}
.remark-list-item.active-item{
  box-shadow: 0px 3px 6px #15C39A;
}
.item-header{
  width: 310px;
  height: 60px;
  background: #15C39A;
  opacity: 1;
  border-radius: 6px 6px 0px 0px;
  display: flex;
  box-sizing: border-box;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px 0 18px;
}
.user-info{
  display: flex;
  align-items: center;
}
.user-icon{
  width: 34px;
  height: 34px;
  border-radius: 17px;
  margin-right: 11px;
  background-color: #fff;
  line-height: 34px;
  text-align: center;
  font-size: 20px;
  font-family: Inter-Bold;
}
.user-name{
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 19px;
  color: #FFFFFF;
  opacity: 1;
  text-align: left;
}
.user-time{
  font-size: 10px;
  line-height: 14px;
}
.remark-item-content{
  width: 310px;
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 15px 15px 0;
  margin-bottom: 15px;
  flex: 1;
  word-break: break-all;
}
.remark-text{
  font-size: 10px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  text-align: justify;
}
video{
  width: 100%; height: 100%; object-fit: cover
}
</style>