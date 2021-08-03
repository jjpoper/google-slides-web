<template>
  <div class="studentComment" :style="`height: ${webHeight}px; `" v-if="modalVisibale">
    <div class="title">
      <p>Student Feedback</p>
      <i @click="hidecomment"></i>
    </div>
    <div class="feeditem" v-for="(item, index) in commentList" :key="index.toString()">
      <p class="itemtile">slide {{getIndex(item.pageId)}}</p>
      <div :class="`readed ${unreadIdList.indexOf(item.id) > -1 ? 'unread' : ''}`">
        <div class="feedinner">
          <div class="rightcontent">
            <div v-show="!slidesVisiable[index]">
              <div class="right-answer" v-if="item.title.indexOf('data:image/') > -1">
                <div class="pptimage">
                  <base64image :url="item.title" />
                </div>
              </div>
              <div class="right-answer" v-else-if="item.title.indexOf('.mp3') > -1">
                <div class="pptimage">
                  <audio
                    preload="meta"
                    controlslist="nodownload" controls=""
                    :src="item.title" style="width:80%;"/>
                </div>
              </div>
              <div class="right-answer" v-else-if="item.title.indexOf('.webm') > -1">
                <div class="pptimage">
                  <video
                    controlslist="nodownload" controls=""
                    preload="meta"
                    :src="item.title" style="width:80%;"/>
                </div>
              </div>
              <div class="right-answer" v-else-if="item.title.indexOf('[') > -1">
                <p v-for="(text,index) in JSON.parse(item.title)" :key="index">{{text}}</p>
              </div>
              <div class="right-answer" v-else>{{item.title}}</div>
            </div>
            <template v-if="getUrl(item.pageId)">
              <div class="pptitemouter" v-show="slidesVisiable[index]">
                <div class="pptitem" >
                  <div class="pptimage" :style="`background-image:url(${getUrl(item.pageId)})`"></div>
                </div>
                <div class="stpage">{{getIndex(item.pageId)}} / {{slides.length}}</div>
              </div>
            </template>
            <div class="rightbutton" @click="setVis(index)" v-if="getButtonVis(item.pageId)"></div>
          </div>
          <div class="rightcomment">
            <div class="puserinfo">
              <p class="uname">{{item.teacherName}}</p>
              <p class="utime">{{item.time}}</p>
              <i class="uicon">{{item.teacherName.split("")[0]}}</i>
            </div>
            <div class="rightcommentmediadetail"
              v-if="item.commentType === 'video' || item.commentType === 'audio'">
              <video
                v-if="item.commentType === 'video'"
                preload="meta"
                controlslist="nodownload" controls="" 
                :src="item.value" style="width:80%;"/>
              <audio
                v-else-if="item.commentType === 'audio'"
                preload="meta"
                controlslist="nodownload" controls=""
                :src="item.value" style="width:80%;"/>
            </div>
            <div class="rightcommenttextdetail"
              v-else>
              {{ item.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ModalEventsNameEnum } from "@/socket/socketEvents";
import { getStudentCommentList, getUnreadStudentCommentIds, removeUnreadStudentCommentId } from "@/model/store.student";
import { showToast } from "@/utils/loading";
import base64image from "../base64image.vue";
export default {
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    slides: {
      type: Array,
      default: () => {
        return []
      }
    },
    hidePropsStudentModal: {
      type: Function,
      default: () => null
    }
  },
  data() {
    return {
      modalVisibale: false,
      commentList: [],
      webHeight: window.winHeight  - 50,
      slidesVisiable: [],
      unreadIdList: []
    }
  },
  components: { base64image },
  mounted() {
    // this.showStudentModal()
    EventBus.$on(ModalEventsNameEnum.SHOW_STUDENT_MODAL, status => {
      if (status) {
        this.showStudentModal();
      } else {
        this.hideStudentModal();
      }
    });

    EventBus.$on(ModalEventsNameEnum.SHOW_STUDENT_MODAL_REFRESH, () => {
      this.refreshList();
    });
  },
  methods: {
    showStudentModal() {
      this.refreshList()
      this.modalVisibale = true;
    },
    hideStudentModal() {
      this.modalVisibale = false;
      this.commentList = [];
    },
    refreshList() {
      const list = getStudentCommentList();
      this.unreadIdList = getUnreadStudentCommentIds()
      this.commentList = list;
      console.log(list, this.unreadIdList);
      showToast("new messages loaded");
    },
    getIndex(page_id) {
      const index = this.slides.findIndex(item => item.page_id === page_id)
      return index + 1
    },
    getUrl(page_id) {
      const item = this.slides.filter(item => item.page_id === page_id)[0]
      return item ? item.thumbnail_url : false
      return "https://dev.api.newzealand.actself.me/20210801094156/SLIDES_API539350515_0.png"
      // return item.thumbnail_url
    },
    getButtonVis(page_id) {
      const index = this.slides.findIndex(item => item.page_id === page_id)
      if(index == this.currentIndex) return false
      return this.getUrl(page_id)
    },
    setVis(index){
      this.slidesVisiable[index] = !this.slidesVisiable[index]
      this.$forceUpdate()
    },
    hidecomment() {
      this.hidePropsStudentModal()
    }
  }
};
</script>
<style scoped>
.studentComment {
  overflow-y: scroll;
  box-sizing: border-box;
  padding: 29px 32px 29px 29px;
  background-color: #fff;
  line-height: 50px;
  text-align: left;
  z-index: 9998;
  position: fixed;
  top:0;
  right:0;
  width: 550px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.title {
  display: flex;
  flex-direction: row;
  height: 30px;
  justify-content: space-between;
  line-height: 30px;
}
.title p{
  font-size: 16px;
  font-family: Segoe UI;
  font-weight: bold;
  color: #15C39A;
}
.title i{
  width: 30px;
  height: 30px;
  border-radius: 15px;
  cursor: pointer;
  background-image: url(../../assets/picture/closecom.png);
  background-repeat: no-repeat;
  background-size: 30px 30px;
}
.section {
  margin-bottom: 10px;
}
.itemtile{
  margin: 20px 0;
  height: 19px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142D;
  opacity: 1;
}
.feedinner{
  width: 477px;
  background: #FFFFFF;
  opacity: 1;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 6px;
}
.readed{
  border: 1px solid #DBDBDB;
  width: 489px;
  background: #FFFFFF;
  overflow: hidden;
  border-radius: 6px;
  padding: 5px;
  box-sizing: border-box;
}
.unread{
  border-color: #15C39A;
  background: #d0f3eb;
}
.rightcontent{
  border-bottom: 1px solid #DBDBDB;
}
.pptitemouter{
  margin: 24px 0 0 45px;
  width: 321px;
  overflow: hidden;
}
.right-answer {
  margin: 21px;
}
.rightbutton{
  width: 50px;
  height: 50px;
  position: absolute;
  top:21px;
  right: 19px;
  background-image: url(../../assets/picture/exchange.png);
  background-repeat: no-repeat;
  background-size: 50px 50px;
  cursor: pointer;
}
.pptimage{
  width: 321px;
  height: 139px;
  background: #FFFFFF;
  border: 1px solid #DBDBDB;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.stpage{
  min-width: 60px;
  height: 20px;
  background: #E4E4E4;
  opacity: 0.4;
  text-align: center;
  line-height: 20px;
  margin-top: 10px;
  margin-bottom: 16px;
  float: right;
}

.rightcomment {
  width: 100%;
  min-height: 70px;
  box-sizing: border-box;
  padding: 10px;
  word-wrap: break-word;
  line-height: 20px;
  margin-top: 42px;
  padding: 0 21px 21px 21px;
}
.puserinfo{
  width: 100%;
  height: 30px;
  padding-left: 40px;
  justify-content: space-around;
  position: relative;
}
.uname{
  font-size: 12px;
  font-family: Inter-Bold;
  color: #000000;
  opacity: 1;
  line-height: 16px;
}
.utime{
  font-size: 10px;
  font-family: Inter-Bold;
  color: #808191;
  opacity: 1;
  line-height: 14px;
}
.uicon{
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  background-color: tomato;
  font-style: normal;
  font-size: 16px;
  position: absolute;
  top: 0;
  left: 0;
  color: #fff;
  border-radius: 15px;
}
.rightcommenttextdetail{
  width: 443px;
  min-height: 99px;
  background: #F7F7F7;
  border: 1px solid #DBDBDB;
  opacity: 1;
  border-radius: 4px;
  margin-top: 15px;
  padding: 10px;
  box-sizing: border-box;
}
.rightcommentmediadetail{
  width: 443px;
  min-height: 99px;
  background: #F7F7F7;
  border: 1px solid #DBDBDB;
  opacity: 1;
  border-radius: 4px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}
video{
  width: 100%; height: 100%; object-fit: cover
}
</style>