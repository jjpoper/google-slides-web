<template>
  <div class="studentComment" :style="`height: ${webHeight}px; `" v-if="modalVisibale">
    <div class="title">
      <p>Student Feedback</p>
      <i @click="hidecomment"></i>
    </div>
    <template v-for="(item, index) in commentList">
      <div class="feeditem" v-if="item.title" :key="index.toString()">
        <p class="itemtile">slide {{getIndex(item.pageId)}}</p>
        <div :class="`readed ${item.id && unreadStudentCommentIds.indexOf(item.id) > -1 ? 'unreadborder' : ''}`">
          <div class="feedinner">
            <div class="rightcontent">
              <div v-show="!slidesVisiable[index]">
                <div class="right-answer" v-if="getIndexOf(item.title, 'data:image/') > -1">
                  <div class="pptimage">
                    <base64image :url="item.title" />
                  </div>
                </div>
                <div class="right-answer" v-else-if="getIndexOf(item.title, '.mp3') > -1">
                  <div class="pptimage">
                    <div style="width:80%;">
                      <audio-player :url="item.title" />
                    </div>
                  </div>
                </div>
                <div class="right-answer" v-else-if="getIndexOf(item.title, '.webm') > -1">
                  <div class="pptimage">
                    <video
                      controlslist="nodownload"
                      controls
                      preload="meta"
                      :src="item.title"
                      style="width:80%;"
                    />
                  </div>
                </div>
                <div class="right-answer" v-else-if="getIndexOf(item.title, '[') > -1">
                  <p v-for="(text,index) in JSON.parse(item.title)" :key="index">{{text}}</p>
                </div>
                <div class="right-answer" v-else-if="getIndexOf(item.title) === 'file' ">
                  {{item.title.fileName}}
                </div>
                <div class="right-answer" v-else>{{item.title}}</div>
              </div>
              <template v-if="getUrl(item.pageId)">
                <div class="right-answer pptitemouter" v-show="slidesVisiable[index]">
                  <div class="pptitem">
                    <div class="pptimage" :style="`background-image:url(${getUrl(item.pageId)})`"></div>
                  </div>
                  <div class="stpage">{{getIndex(item.pageId)}} / {{slides.length}}</div>
                </div>
              </template>
              <div class="rightbutton" @click="setVis(index)" v-if="getButtonVis(item.pageId)"></div>
            </div>
            <div class="border-line"></div>
            <div class="rightcomment">
              <div class="puserinfo">
                <p class="uname">{{item.teacherName}}</p>
                <p class="utime">{{item.time}}</p>
                <i class="uicon">{{item.teacherName.split("")[0]}}</i>
              </div>
              <div
                class="rightcommentmediadetail"
                v-if="item.commentType === 'video' || item.commentType === 'audio'"
              >
                <video
                  v-if="item.commentType === 'video'"
                  preload="meta"
                  controlslist="nodownload"
                  controls
                  :src="item.value"
                  style="width:80%;"
                />
                <div v-else-if="item.commentType === 'audio'" style="width:80%;">
                  <audio-player :url="item.title" />
                </div>
              </div>
              <div class="rightcommenttextdetail" v-else>{{ item.value }}</div>
              <!-- <div class="rightcommenttextdetail" >{{ item.value }}</div> -->
            </div>
          </div>
          <div
            v-if="item.id && unreadStudentCommentIds.indexOf(item.id) > -1"
            class="unread"
            @click="enterRead(item.id)"
          ></div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { ModalEventsNameEnum } from "@/socket/socketEvents";
// import {
//   getStudentCommentList,
//   getUnreadStudentCommentIds,
//   removeUnreadStudentCommentId
// } from "@/model/store.student";
import {mapState, mapGetters, mapActions} from 'vuex'
import { showToast } from "@/utils/loading";
import base64image from "../base64image.vue";
import AudioPlayer from "../common/audioPlayer.vue";
export default {
  computed: {
    ...mapState({
      unreadStudentCommentIds: state => state.student.unreadStudentCommentIds,
    }),
    ...mapGetters({
      currentPageId: 'student/currentPageId',
      currentFeedList: 'student/currentFeedList',
    }),
  },
  props: {
    currentIndex: {
      type: Number,
      default: 0
    },
    slides: {
      type: Array,
      default: () => {
        return [];
      }
    },
    hidePropsStudentModal: {
      type: Function,
      default: () => null
    }
  },
  watch: {
    currentFeedList() {
      console.log(this.currentFeedList, 'currentFeedList')
    }
  },
  data() {
    return {
      modalVisibale: false,
      webHeight: window.winHeight - 50,
      slidesVisiable: [],
      unreadIdList: []
    };
  },
  components: { base64image, AudioPlayer },
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
      showToast("new messages loaded");
      this.refreshList();
    });
  },
  methods: {
    ...mapActions("student", [
      "delUnreadCommentId",
    ]),
    showStudentModal() {
      this.refreshList();
      this.modalVisibale = true;
    },
    hideStudentModal() {
      this.modalVisibale = false;
      // this.commentList = [];
    },
    refreshList() {
      // const list = getStudentCommentList();
      // this.unreadIdList = getUnreadStudentCommentIds();
      // console.log(list)
      this.commentList = this.currentFeedList.reverse();
      console.log(this.commentList, '=commentList')
      // console.log(list, this.unreadIdList);
    },
    getIndex(page_id) {
      const index = this.slides.findIndex(item => item.page_id === page_id);
      return index + 1;
    },
    getUrl(page_id) {
      const item = this.slides.filter(item => item.page_id === page_id)[0];
      return item ? item.thumbnail_url : false;
      // return item.thumbnail_url
    },
    getButtonVis(page_id) {
      const index = this.slides.findIndex(item => item.page_id === page_id);
      if (index == this.currentIndex) return false;
      return this.getUrl(page_id);
    },
    setVis(index) {
      this.slidesVisiable[index] = !this.slidesVisiable[index];
      this.$forceUpdate();
    },
    hidecomment() {
      this.hidePropsStudentModal();
    },
    enterRead(id) {
      if (id) {
        this.delUnreadCommentId(id);
        // this.unreadIdList = getUnreadStudentCommentIds();
      }
    },
    getIndexOf(titleValue, indexKey) {
      const typeName = Object.prototype.toString.call(titleValue)
      if(typeName === '[object String]') {
        return titleValue.indexOf(indexKey)
      } else if(typeName === '[object Object]' && titleValue.fileName) {
        return 'file'
      }
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
  top: 0;
  right: 0;
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
.title p {
  font-size: 16px;
  font-family: Segoe UI;
  font-weight: bold;
  color: #15c39a;
}
.title i {
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
.itemtile {
  margin: 20px 0;
  height: 19px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #11142d;
  opacity: 1;
}
.feedinner {
  width: 489px;
  background: #e5e5e5;
  opacity: 1;
  position: relative;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 6px;
}
.readed {
  border: 1px solid #dbdbdb;
  width: 489px;
  background: #ffffff;
  overflow: hidden;
  border-radius: 6px;
  box-sizing: border-box;
  position: relative;
}
.readed.unreadborder {
  border-color: red;
  /* border-width: 6px; */
}
.unread {
  border-color: #15c39a;
  background: transparent;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  border: 6px solid red;
  cursor: pointer;
}
.border-line {
  width: 489px;
  height: 1px;
  background-color: #dbdbdb;
}
.unreadborder .border-line {
  width: 475px;
  margin-left: 6px;
}
.pptitemouter {
  width: 321px;
  overflow: hidden;
}
.right-answer {
  margin: 21px;
}
.rightbutton {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 21px;
  right: 19px;
  background-image: url(../../assets/picture/exchange.png);
  background-repeat: no-repeat;
  background-size: 50px 50px;
  cursor: pointer;
}
.pptimage {
  width: 321px;
  height: 139px;
  background: #ffffff;
  border: 1px solid #dbdbdb;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.stpage {
  min-width: 60px;
  height: 20px;
  background: #e4e4e4;
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
  /* margin-top: 42px; */
  padding: 42px 21px 21px 21px;
  background-color: #fff;
}
.puserinfo {
  width: 100%;
  height: 30px;
  padding-left: 40px;
  justify-content: space-around;
  position: relative;
}
.uname {
  font-size: 12px;
  font-family: Inter-Bold;
  color: #000000;
  opacity: 1;
  line-height: 16px;
}
.utime {
  font-size: 10px;
  font-family: Inter-Bold;
  color: #808191;
  opacity: 1;
  line-height: 14px;
}
.uicon {
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
.rightcommenttextdetail {
  width: 443px;
  min-height: 99px;
  background: #f7f7f7;
  border: 1px solid #dbdbdb;
  opacity: 1;
  border-radius: 4px;
  margin-top: 15px;
  padding: 10px;
  box-sizing: border-box;
}
.rightcommentmediadetail {
  width: 443px;
  min-height: 99px;
  background: #f7f7f7;
  border: 1px solid #dbdbdb;
  opacity: 1;
  border-radius: 4px;
  margin-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
}
video {
  width: 100%;
  /* height: 100%; */
  object-fit: cover;
}
</style>