<template>
  <div class="remark-container">
    <div class="remark-control">
      <el-tooltip content="Audio Comment" placement="top">
        <div class="remark-button-outer">
          <img @click="audio" src="../../assets/picture/voice-button.png" class="remark-button"/>
        </div>
      </el-tooltip>
       <el-tooltip content="Video Comment" placement="top">
         <div class="remark-button-outer">
          <img @click="video" src="../../assets/picture/video.png" class="remark-button"/>
         </div>
      </el-tooltip>
       <el-tooltip content="Text Comment" placement="top">
         <el-upload
          class="remark-button-outer"
          action="https://dev.api.newzealand.actself.me/file/upload"
          :on-success="onUpload"
          :show-file-list="false"
          accept=".doc,.docx,.pdf,application/pdf"
          list-type="picture">
            <img @click="upload" src="../../assets/picture/add.png" class="remark-button"/>
        </el-upload>
      </el-tooltip>
    </div>
    <ul class="remark-list">
      <!--输入区域item-->
      <li v-if="recordType" class="remark-list-item record-item active-item">
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
          <record-video v-if="recordType === ModalEventsTypeEnum.VIDEO" :onSend="sendCommentCb" />
          <record-audio v-else-if="recordType === ModalEventsTypeEnum.AUDIO" :onSend="sendCommentCb" />
        </div>
      </li>
      <li
        class="remark-list-item"
        v-for="item in answerList" :key="item.id">
        <div class="item-header">
          <div class="user-info">
            <div class="user-icon">
              {{userInfo.name ? userInfo.name.substr(0, 1) : ''}}
            </div>
            <div>
              <p class="user-name" v-if="userInfo.name">{{userInfo.name}}</p>
              <p class="user-name user-time">{{getTimeStr(item.updated_at)}}</p>
            </div>
          </div>
          <div v-if="item.id" @click.stop="deleteItem(item.id)" class="delete-button"></div>
        </div>
        <div class="remark-item-content" >
          <video
            v-if="item.content && item.content.mediaType === 'video'"
            controlslist="nodownload"
            controls=""
            :src="item.content.link"
            width="280"
            height="150"
            preload="none"
          />
          <audio
            v-else-if="item.content &&  item.content.mediaType === 'audio'"
            controlslist="nodownload"
            controls=""
            :src="item.content.link"
            style="width:100%;"
            preload="none"
          />
          <div
            class="remark-text"
            v-else-if="item.content.mediaType === 'file'"
          >
            <a :href="item.content.link" download>{{item.content.link}}</a>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { ModalEventsTypeEnum } from '@/socket/socketEvents'
import {mapActions, mapState, mapGetters} from 'vuex'
import { sendAudioOrVideoAnswer } from '@/socket/socket.student'
import RecordAudio from "../common/recordAudio.vue";
import RecordVideo from "../common/recordVideo.vue";
import RecordText from '../common/recordText.vue';
import { showToast } from '@/utils/loading';
import { getAnswerTimeStr } from '@/utils/help';
export default {
  components:{
    RecordVideo, RecordAudio, RecordText
  },
  computed: {
    ...mapState({
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
      userInfo: state => state.student.studentUserInfo,
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList',
      currentPageId: 'student/currentPageId',
    }),
    answerList() {
      return this.currentPageAnswerList.reverse().map(item => {
        return {
          ...item,
          ...JSON.parse(item.data)
        }
      })
    }
  },
  created() {
    console.log(this.currentPageAnswerList)
  },
  data() {
    return {
      ModalEventsTypeEnum,
      recordType: null
    }
  },
  methods: {
    ...mapActions('student', [
      'updateAnswerdPage',
      'updateAllAnswerdList'
    ]),
    audio() {
      this.recordType = ModalEventsTypeEnum.AUDIO
    },
    video() {
      this.recordType = ModalEventsTypeEnum.VIDEO
    },
    upload() {

    },
    deleteItem(id) {
    },
    getTimeStr(time) {
      return getAnswerTimeStr(time * 1000)
    },
    cancelRecord() {
      this.recordType = null
    },
    onUpload(response, file, fileList) {
      console.log(response.data, file.name, fileList);
      this.sendCommentCb(response.data, 'file')
    },
    sendCommentCb(link, mediaType = "") {
      this.cancelRecord()
      sendAudioOrVideoAnswer({
        link,
        mediaType,
        page_id: this.currentPageId
      })
      // 已答
      this.updateAnswerdPage(this.currentPageIndex)
      // 追加问答内容
      // data: "{\"type\": \"audio\", \"content\": \"https://dev.api.newzealand.actself.me/upload/7567b679ed141e55.mp3\", \"item_id\": \"0\", \"page_id\": \"SLIDES_API1051876605_49\", \"user_id\": \"k.liu2369@gmail.com\", \"user_name\": \"刘凯\"}"
      this.updateAllAnswerdList({
        data: JSON.stringify({
          content: {
            link,
            mediaType
          },
        }),
        id: Math.random(),
        item_id: null,
        page_id: this.currentPageId,
        student_user_id: this.userInfo.uid,
        type: "audio",
        updated_at: Date.now() / 1000
      })
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