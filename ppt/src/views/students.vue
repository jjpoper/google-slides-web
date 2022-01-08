<template>
  <div class="page">
    <el-dialog :visible.sync="showLoginDialog" custom-class="custom-dialog">
      <StudentLoginPage :joinRoom="loginRoom" :googleLogin="googleLogin" :class_id="class_id" />
    </el-dialog>
    <class-room-closed
      v-if="classRoomInfo && classRoomInfo.status == 'close'"
      :class_id="classRoomInfo.class_id"
      :token="token"
    />
    <pageLockedNote
      v-else-if="
        ((classRoomInfo && isPageLocked()) || lock_all_pages) && currentItemData
      "
      :data="currentItemData"
      :answerList="answerList"
    />

    <div class="student-page" v-else>
      <!-- <student-questions
        v-if="questionModalVisiable"
        :sendQuestion="sendQuestion"
        :list="filterMarkupList"
        :url="currentItemData && currentItemData.thumbnail_url"
        :pageId="slides[currentPageIndex].page_id"
        :delQuestion="delQuestion"
      />-->

      <students-ppt-list v-if="currentModel == 'Student-Paced'" :changePage="pageChange"/>
      <div class="student-main" v-show="!questionModalVisiable">
        <div
          v-if="
            fullScreen &&
            currentItemData &&
            currentItemData.thumbnail_url &&
            (!currentItemData.items[0] ||
              currentItemData.items[0].type !== 'draw')
          "
          class="full_screen"
          @click="showFullScreen(false)"
        >
          <pptcontent
            :url="currentItemData.thumbnail_url"
            :filterAddedMediaList="filterAddedMediaList"
            :meterialVisiable="meterialVisiable"
            :isStudentPaced="isStudentPaced"
          />
        </div>
        <div
          class="student-left"
          v-if="
            currentItemData &&
            currentItemData.thumbnail_url &&
            ((!currentItemData.items[0] ||
              currentItemData.items[0].type !== 'draw') || meterialVisiable)
          "
        >
          <div class="st-ppt-outer">
            <pptcontent
              class="ppt-out-line"
              v-if="currentItemData && currentItemData.thumbnail_url"
              :url="currentItemData.thumbnail_url"
              :filterAddedMediaList="filterAddedMediaList"
              :meterialVisiable="meterialVisiable"
              :isStudentPaced="isStudentPaced"
            />
          </div>
        </div>
        <div
          class="student-right"
          :style="`width: ${getWidthPercent(currentItemData.items[0].type)}`"
          v-if="currentItemData && currentItemData.items[0] && !(meterialVisiable && currentItemData.items[0].type === 'draw' )"
        >
          <StudentsIndexItem
            :data="currentItemData"
            :type="currentItemData.items[0].type"
            :method="answerText"
            :answer="answerChoice"
            :sendCanvas="sendCanvas"
            :sendDrawText="sendDrawText"
            :slide_id="slide_id"
            :url="currentItemData.thumbnail_url"
            :sendAudioOrVideoAnswer="sendAudioOrVideoAnswer"
            :link="link"
          />
        </div>
        <div class="right-fix-area">
          <tips-list v-if="overviewModalVisiable" :filterTips="filterTips" />
          <student-comment
            :currentIndex="parseInt(currentPageIndex)"
            :slides="slides"
            :hidePropsStudentModal="hideStudentModal"
          />
        </div>

        <div class="sfooter" v-if="slides && slides.length > 0">
          <student-control-panel
            :lastPage="lastPage"
            :nextPage="nextPage"
            :totalPage="slides.length"
            :isStudentPaced="isStudentPaced"
            :showStudentModal="showStudentModal"
            :isShowQuestion="isShowQuestion"
            :changeShowOrAnswer="changeShowOrAnswer"
            :fullScreenWidth="screenWidth"
            :screenWidth="currentScreenWidth"
            :smallWindow="smallWindow"
            :changeShowMetrial="changeShowMetrial"
            :meterialVisiable="meterialVisiable"
            :filterAddedMediaList="filterAddedMediaList"
          />
        </div>
      </div>
    </div>

    <div class="top_btn">
      <el-tooltip :content="`${onLine ? 'Online' : 'Offline'}`" placement="top">
        <div class="online_status">
          <i class="el-icon-s-opportunity" :style="`color: ${onLine ? 'green' : 'red'}`" />
        </div>
      </el-tooltip>
      <div
        class="deadline_info"
        v-if="showRemainTime()"
      >Deadline time remain: {{ getDeadLineStr(countDownMin) }}</div>
      <el-tooltip content="mark up and send comment" placement="top">
        <div class="readchat comment"></div>
      </el-tooltip>
      <div
        class="deadline_info"
        v-if="showRemainTime()"
      >Deadline time remain:{{ countDownMin }} mintues.</div>

      <div class="deadline_info" v-if="showCorrect">You are unable to change your answer</div>

      <div style="flex: 1"></div>

      <img
        src="../assets/icon/screen_all.png"
        width="50"
        height="50"
        class="icon"
        @click="showFullScreen(true)"
        v-if="
          !fullScreen &&
          !smallWindow &&
          !questionModalVisiable &&
          currentItemData &&
          currentItemData.thumbnail_url &&
          currentItemData.items[0] &&
          currentItemData.items[0].type !== 'draw'
        "
      />
    </div>

    <!-- <el-popover placement="left" trigger="manual" v-model="showTip" width="200">
      <div class="tip_area_popover">{{ tipText }}</div>
      <img
        src="../assets/icon/tip_close.png"
        width="30"
        height="30"
        slot="reference"
        class="tip_area"
        v-if="
          currentItemData &&
          (!currentItemData.items ||
            currentItemData.items.length == 0 ||
            currentItemData.items[0].type == 'draw') &&
          tipText.length > 0 &&
          !showTip
        "
        @click="changeTipShow()"
      />
      <img
        src="../assets/icon/tip_open.png"
        width="30"
        height="30"
        slot="reference"
        class="tip_area"
        v-if="
          currentItemData &&
          (!currentItemData.items ||
            currentItemData.items.length == 0 ||
            currentItemData.items[0].type == 'draw') &&
          tipText.length > 0 &&
          showTip
        "
        @click="changeTipShow()"
      />
    </el-popover> -->

    <!-- <div class="web_site_icon">
      <el-popover
        placement="top"
        width="200"
        trigger="hover"
        v-if="websiteList&&websiteList.length>0"
      >
        <div
          v-for="(item, index) in websiteList"
          :key="index"
          class="website--content"
          @click="openWebsitePage(item)"
        >{{item.url}}</div>
        <img
          src="../assets/web@2x.png"
          width="75"
          height="35"
          slot="reference"
          style="margin-left: 20px"
        />
      </el-popover>
    </div> -->

    <div id="diycolor_comment"></div>

    <el-dialog
      :center="true"
      :visible.sync="isWaitingStart"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      custom-class="custom-dialog"
      width="900px">
      <waiting-start :waiting-start-seconds="waitingStartSeconds"/>
    </el-dialog>
  </div>
</template>
<script>
import pptcontent from "../components/pptcontent";
import {
  getAllPPTS,
  getStudentLoginUrl,
  getUserProfile,
  queryClassStatus,
  getAVComment,
  anmonymousLogin,
  getAllGroupMember,
  getCurrentClassPageIndex
} from "../model/index";
import { initStudentData } from "@/model/data.student";
import { initStudentCommentData } from "@/model/comment.student";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import StudentsIndexItem from "../components/students/Index";
import { createSo, setStudentWxBaseParams } from "../socket/socket.student";
import {
  ModalEventsNameEnum,
  SocketEventsEnum,
  ClassRoomModelEnum
} from "../socket/socketEvents";
import {
  saveStudentsCurrentPageAnswerList,
  getStudentCurrentPageAnswerList,
  saveStudentUserName,
  unreadStudentComment,
  getStudentCommentUnReadStatus,
  readStudentComment,
  getStudentStoreToken,
  saveStudentStoreToken,
  initStudentStoreSlideId,
  saveStudentLocalStoreToken,
  getStudentLocalStoreToken,
} from "@/model/store.student";
import { MessageBox } from "element-ui";
import StudentComment from "@/components/students/studentComment.vue";
import ClassRoomClosed from "@/components/students/classRoomClosed.vue";
import studentControlPanel from "@/components/students/studentControlPanel.vue";
import pageLockedNote from "@/components/students/pageLockedNote.vue";
import StudentQuestions from "@/components/students/studentQuestions.vue";
import colorSelector from "@/utils/color";
import TipsList from "@/components/common/tipsList.vue";

import { mapActions, mapState } from "vuex";
import StudentsPptList from "@/components/students/studentsPptList.vue";
import StudentLoginPage from "@/components/students/studentLoginPage.vue";
import moment from 'moment'
import WaitingStart from "@/components/students/waitingStart.vue";

export default {
  data() {
    return {
      pptUrl: null,
      title: "",
      options: [],
      slides: [],
      slide_id: 0,
      currentSo: null,
      allAnswers: {},
      uname: "",
      type: "",
      currentData: null,
      currentItemData: null,
      currentAnswerd: false,
      unread: false,
      modalVisiable: false,
      oken: "",
      currentModel: ClassRoomModelEnum.TEACHER_MODEL, //课堂模式，学生自己能否切换页面
      uid: "", // uid
      class_id: "",
      classRoomInfo: null,
      answerList: [],
      onLine: false, // 在线状态
      deadLineTimer: null,
      limitText: null,
      lock_all_pages: false,
      countDownMin: 0,
      questionModalVisiable: false, // ppt 反馈面板
      showCorrect: false,
      fullScreen: false,
      screenWidth: 0,
      screenHeight: 0,
      isShowQuestion: true,
      currentScreenWidth: 700,
      smallWindow: false,
      smallWindowValue: 800,
      link: "",
      allAddedMediaList: [],
      meterialVisiable: false,
      overviewModalVisiable: false,
      studentCommentLoaded: false,
      firstJoined: true,
      showTip: false,
      tipText: "",
      websiteUrl: "",
      showLoginDialog: false,
      metrialStatusMap: {},
      studentPaceLastPage: -1, // 学生模式下最后操作的页码

      isWaitingStart: false,
      sessionStartDateTime: null,
      waitingStartSeconds: 0,
      waitingTimer: null
    };
  },
  computed: {
    ...mapState({
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides
    }),
    websiteList() {
      let list = [];
      // if (this.slides[this.currentPageIndex]) {
      //   let elements = this.slides[this.currentPageIndex].elements;
      //   console.log("current page website urls::", elements);
      //   if (elements && elements.length > 0) {
      //     list = elements.filter(item => item.type == "website");
      //   }
      // }
      return list;
    },
    filterAddedMediaList() {
      if (this.slides[this.currentPageIndex]) {
        return this.slides[this.currentPageIndex].elements.filter(
          item => item.type !== "tip" && item.position
        );
      } else {
        return [];
      }
    },
    filterTips() {
      if (this.slides[this.currentPageIndex]) {
        const tips = this.slides[this.currentPageIndex].elements.filter(
          item => item.type === "tip"
        );
        console.log(tips, 'tips')
        return tips
      } else {
        return [];
      }
    },
    isStudentPaced() {
      const isStundentPaced = this.currentModel == ClassRoomModelEnum.STUDENT_MODEL
      this.updateIsStudentPaced(isStundentPaced)
      return isStundentPaced
    }
  },
  mounted() {
    this.unread = getStudentCommentUnReadStatus();
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    this.currentScreenWidth = document.body.clientWidth;
    if (
      this.currentItemData &&
      this.currentItemData.items[0] &&
      this.currentItemData.items[0].type != "draw"
    ) {
      this.smallWindow = this.currentScreenWidth < this.smallWindowValue;
    } else {
      this.smallWindow = false;
    }
    window.onresize = () => {
      return (() => {
        this.currentScreenWidth = document.body.clientWidth;
        if (
          this.currentItemData &&
          this.currentItemData.items[0] &&
          this.currentItemData.items[0].type != "draw"
        ) {
          this.smallWindow = this.currentScreenWidth < this.smallWindowValue;
        } else {
          this.smallWindow = false;
        }
      })();
    };
  },
  components: {
    WaitingStart,
    pptcontent,
    StudentsIndexItem,
    StudentComment,
    ClassRoomClosed,
    studentControlPanel,
    pageLockedNote,
    StudentQuestions,
    TipsList,
    StudentsPptList,
    StudentLoginPage
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { id } = vm.$route.params;
      const { token, p } = to.query;
      vm.class_id = id;
      vm.getGroups();
      const anonymous = to.query.anonymouse;
      initStudentStoreSlideId(id);
      if (token) {
        vm.token = token;
        saveStudentStoreToken(token);
        vm.initWithToken();
      } else {
        if (!anonymous || anonymous == "false") {
          vm.token = getStudentStoreToken();
          vm.initWithToken();
        } else {
          //进行匿名登录
          console.log("!token", anonymous);
          vm.loginWithoutToken();
        }
      }
    });
  },
  watch: {
    currentPageIndex() {
      // console.log("set elements");
      this.doAfterPageChange();
      this.changeTipByWatchSlides();
      this.meterialVisiable = this.metrialStatusMap[this.currentPageIndex]
      // let elements = this.slides[this.currentPageIndex].elements;
      // if (elements && elements.length > 0) {
      //   this.websiteList = elements.filter((item) => itme.type == "website");
      //   console.log("current page website urls::", this.websiteList);
      // } else {
      //   this.websiteList = [];
      // }
      if(this.isStudentPaced) {
        this.studentPaceLastPage = this.currentPageIndex
      } else {
        this.hideStudentModal()
      }
    },
    studentAllSlides() {
      this.changeTipByWatchSlides();
    }
  },
  methods: {
    ...mapActions("student", [
      "setElements",
      "setStudentPageIndex",
      "setStudentAllSlides",
      "setStudentUserInfo",
      "updateAnswerdPage",
      "setAllAnswerdList",
      "updateAllAnswerdList",
      "deleteOnAnswerById",
      "updateSlideItemTip",
      "updateSlideCorrectAnswer",
      "setAllGroups",
      "addStudentComment",
      "updateIsStudentPaced",
      "setStudentFeedBackComment"
    ]),
    ...mapActions("remark", [
      "showRemarkModal",
      "setAllRemarkList",
      "updateLatestRemarkId"
    ]),
    changeTipShow() {
      this.showTip = !this.showTip;
      // console.log("change show !!" + this.showTip);
    },
    getGroups() {
      getAllGroupMember(this.class_id).then(list => {
        console.log(this.class_id, list);
        this.setAllGroups(list);
      });
    },
    loginWithoutToken() {
      const localToken = getStudentLocalStoreToken()
      if(localToken) {
        this.token = localToken
        this.initWithToken()
      } else {
        this.showLoginDialog = true;
      }

      console.log("login without token!", this.showLoginDialog);
    },
    loginRoom(name, group_id) {
      console.log(name, group_id);
      if (!name || name.length < 1) {
        this.$message.error("Please input your name");
        return;
      }
      this.doAnmonymousLogin({name, group_id})
    },

    doAnmonymousLogin({name, group_id}) {
      anmonymousLogin(name, group_id).then(res => {
        console.log(res.token);
        this.token = res.token;
        // 缓存匿名登录信息
        saveStudentLocalStoreToken(res.token)
        this.initWithToken();
        this.showLoginDialog = false;
      });
    },

    googleLogin() {
      this.token = getStudentStoreToken();
      this.initWithToken();
      this.showLoginDialog = false;
    },
    changeTipByWatchSlides() {
      if (
        this.studentAllSlides &&
        this.studentAllSlides[this.currentPageIndex]
      ) {
        this.setElements(this.studentAllSlides[this.currentPageIndex].elements);
      }
      if (
        this.studentAllSlides &&
        this.studentAllSlides[this.currentPageIndex] &&
        this.studentAllSlides[this.currentPageIndex].elements
      ) {
        for (
          let i = 0;
          i < this.studentAllSlides[this.currentPageIndex].elements.length;
          i++
        ) {
          if (
            this.studentAllSlides[this.currentPageIndex].elements[i].type ==
            "tip"
          ) {
            this.tipText =
              "tip: " +
              this.studentAllSlides[this.currentPageIndex].elements[i].tip;
          }
        }
      }
    },
    openWebsitePage(item) {
      console.log("open", item.url);
      var strWindowFeatures =
        "width=1500,height=750,menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=100";
      window.open(item.url, "_blank", strWindowFeatures);
    },
    loadDiyPainter() {
      this.$nextTick(() => {
        const selector = document.getElementById("diycolor_comment");
        // console.log(selector, "selector");
        colorSelector.init(selector);
      });
    },
    changeShowOrAnswer() {
      this.isShowQuestion = !this.isShowQuestion;
    },
    getWidthPercent(type) {
      // if (this.questionModalVisiable) return "30%";
      if (type === "draw") return "100%";
      if (type === "comment" || type === "media") return "350px";
      if (this.smallWindow) {
        if (this.isShowQuestion) {
          return "0%";
        } else {
          return "100%";
        }
      }
      return "40%";
    },
    onLineStatusChanged(status) {
      this.onLine = status;
      if (status && this.firstJoined) {
        this.firstJoined = false;
        if (this.classRoomInfo.status == "live") {
          this.currentModel = ClassRoomModelEnum.TEACHER_MODEL;
        } else if (this.classRoomInfo.status == "student-paced") {
          this.currentModel = ClassRoomModelEnum.STUDENT_MODEL;
        }
        if (this.classRoomInfo.response_limit_mode == 2) {
          let time = Date.now();
          let countDown = this.classRoomInfo.response_limit_time - time / 1000;
          if (countDown <= 0) {
            this.lock_all_pages = true;
            return;
          }
          this.handleDeadLineEvent(
            this.classRoomInfo.response_limit_mode,
            countDown
          );
        } else {
          this.handleDeadLineEvent(
            this.classRoomInfo.response_limit_mode,
            this.classRoomInfo.response_limit_time
          );
        }
      }
    },
    initWithToken() {
      showLoading();
      if (!this.token) {
        this.goToLogin();
      } else {
        getUserProfile(this.token).then(({ logout, profile }) => {
          if (logout) {
            this.goToLogin();
          } else {
            this.afterLogin(profile);
          }
        });
      }
    },
    isPageLocked() {
      if (this.currentModel == ClassRoomModelEnum.STUDENT_MODEL) {
        return false;
      }
      if (!this.slides[this.currentPageIndex]) {
        return false;
      }
      if (!this.classRoomInfo || !this.classRoomInfo.lock_page) {
        return false;
      } else {
        for (let i = 0; i < this.classRoomInfo.lock_page.length; i++) {
          if (
            this.classRoomInfo.lock_page[i] ==
            this.slides[this.currentPageIndex].page_id
          ) {
            return true;
          }
        }
      }
      return false;
    },
    showRemainTime() {
      if (this.lock_all_pages) return false;
      if (this.isPageLocked()) return false;
      if (this.currentModel == ClassRoomModelEnum.TEACHER_MODEL) return false;
      if (this.classRoomInfo.response_limit_mode == 0) return false;
      return true;
    },
    goToLogin() {
      getStudentLoginUrl().then(url => {
        // console.log(url);
        if (url) {
          location.href = url;
        }
      });
    },
    getCurrentPageAnswer() {
      if (this.currentItemData) {
        const { page_id, items } = this.currentItemData;
        const type = items[0].type;
        if (type !== "comment") {
          console.log(getStudentCurrentPageAnswerList(page_id, type));
          return getStudentCurrentPageAnswerList(page_id, type);
        } else {
          // comment remark 特殊，数据不在answer内
          return this.$store.state.remark.allRemarks.filter(
            item => item.page_id === page_id
          );
        }
      }
    },
    checkCurrentAnswerd() {
      if (this.currentItemData) {
        const { items } = this.currentItemData;
        if (items[0]) {
          this.answerList = this.getCurrentPageAnswer();
          this.currentAnswerd = this.answerList.length > 0;
          if (this.currentAnswerd) {
            this.updateAnswerdPage(this.currentPageIndex);
            if (this.answerList[0].type == "media") {
              this.link = this.answerList[0].content;
            }
          }
        } else {
          this.currentAnswerd = false;
        }
      }
    },
    getAllSlides() {
      // console.log("list", "========");
      initStudentCommentData(this.class_id, this.token).then((list) => {
        this.studentCommentLoaded = true;
        console.log(list, 'setStudentFeedBackComment')
        this.setStudentFeedBackComment(list)
      });
      Promise.all([
        initStudentData(this.class_id, this.token),
        getAllPPTS(this.slide_id,this.class_id)
      ]).then(([allA, { pages: list }]) => {
        // console.log(list, "========");
        // vuex缓存答案
        this.setAllAnswerdList(allA);
        this.slides = list;
        // vuex 缓存全局slides
        this.setStudentAllSlides(list);
        this.getItemData();
        hideLoading();
        this.loadDiyPainter();
        this.joinRoom();
      });
    },
    sendCanvas(base64Url, texturl, result) {
      console.log(result)
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      saveStudentsCurrentPageAnswerList(page_id, type, {
        key: "item_1_canvas",
        content: base64Url
      });
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"draw", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "0", "content":"${base64Url}","content1":"${texturl}", "result": "${result}"}`
      );
      this.updateAnswerdPage(this.currentPageIndex);
      this.currentAnswerd = true;
    },
    sendDrawText(textContent) {
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"draw_text", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "0", "content":${textContent}}`
      );
      this.updateAnswerdPage(this.currentPageIndex);
      this.currentAnswerd = true;
    },
    // 发送text
    answerText(index, msg, show) {
      // console.log("index==" + index + "  msg==" + msg);
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      this.emitSo(
        "response",
        JSON.stringify({"room": this.class_id, "type":type, "user_id": this.uid, "user_name":this.uname,"token": this.token,"class_id": this.class_id,  "page_id": page_id, "item_id": index, "content":msg,"locked": show})
      );
      saveStudentsCurrentPageAnswerList(page_id, type, {
        item_id: index,
        key: index,
        content: msg
      });
      this.updateAnswerdPage(this.currentPageIndex);
      this.currentAnswerd = true;
    },
    getItemData() {
      this.currentItemData = null;
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentPageIndex];
        console.log(this.currentItemData);
        this.checkCurrentAnswerd();
        this.isShowRightAnswer();
        if (
          this.currentItemData &&
          this.currentItemData.items[0] &&
          this.currentItemData.items[0].type != "draw"
        ) {
          this.smallWindow = this.currentScreenWidth < this.smallWindowValue;
        } else {
          this.smallWindow = false;
        }
        if (this.currentModel == ClassRoomModelEnum.STUDENT_MODEL) {
          // console.log("学生go-to-page");
          this.emitSo(
            "go-to-page",
            `{"room": "${this.class_id}", "token": "${
              this.token
            }","class_id":"${this.class_id}", "params": {"page":"${
              this.slides[this.currentPageIndex].page_id
            }"}}`
          );
        }
      });
    },
    pageChange(page) {
      // console.log(page, "pageChange", this.currentPageIndex);
      const nextPage = parseInt(page);
      if (this.currentPageIndex != nextPage) {
        this.setStudentPageIndex(nextPage);
      } else {
        // console.log("已是当前页码，不用切换", "pageChange");
      }
    },
    doAfterPageChange() {
      this.getItemData();
      this.isShowRightAnswer();
      this.isShowQuestion = true;
    },
    afterLogin({ user_name, email }) {
      this.uname = user_name;
      this.uid = email;
      this.setStudentUserInfo({
        name: user_name,
        uid: email
      });
      saveStudentUserName(this.uname);
      this.beforejoinRoom();
    },
    initRoomConfig(res) {
      this.slide_id = res.slide_id;
    },
    beforejoinRoom() {
      queryClassStatus(this.class_id, this.token)
        .then(res => {
          this.classRoomInfo = res;
          // console.log(this.classRoomInfo);
          this.setStudentPageIndex(parseInt(res.page));
          this.initRoomConfig(res);
          this.afterConnectRoom();
        })
        .catch(res => {
          // console.log(res);
        }).finally(() => {
          if(this.classRoomInfo && this.classRoomInfo.hasOwnProperty("session_start_time")){
            let startTime = this.classRoomInfo.session_start_time
            console.log('startTime', startTime)
            if(startTime) {
              let startTimeDate = moment(startTime).toDate()
              console.log('startTimeDate', startTime)
              console.log('Date.now()', Date.now())
              if(startTimeDate && startTimeDate.getTime() > Date.now()){
                this.isWaitingStart = true
                this.sessionStartDateTime = startTimeDate
                console.log('isWaitingStart ' + this.isWaitingStart + 'sessionStartDateTime ' + this.sessionStartDateTime)
                this.startWaitingTime()
              }
            }
          }
      });
    },
    startWaitingTime () {
      console.log('startWaitingTimer now ' + (Date.now() / 1000) + ' sessionStartDateTime ' + (this.sessionStartDateTime.getTime() / 1000))
      if(this.waitingTimer) {
        clearTimeout(this.waitingTimer)
      }
      let leftSeconds = parseInt((this.sessionStartDateTime.getTime() / 1000) - (Date.now() / 1000))
      if(leftSeconds > 0) {
        console.log('waitingStartSeconds ' + leftSeconds)
        this.waitingStartSeconds = leftSeconds
        this.waitingTimer = setTimeout(() => {
          this.startWaitingTime()
        }, 1000)
      }else {
        this.isWaitingStart = false
        this.waitingStartSeconds = 0
      }
    },
    afterConnectRoom() {
      this.getAllSlides();
      getAVComment(this.class_id, this.token)
        .then(res => {
          // console.log(res);
          if (res.code == "ok") {
            let marks = [];
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].data.fromServie = true; //从服务器处获取
              res.data[i].data.id = res.data[i].id;
              marks.push(res.data[i].data);
            }
            // 初始化remark数据
            this.setAllRemarkList(marks);
          }
        })
        .catch(res => {
          // console.log(res);
        });
    },
    //处理deadline事件
    handleDeadLineEvent(mode, time) {
      this.classRoomInfo.response_limit_mode = mode;
      this.classRoomInfo.response_limit_time = time;
      time = time * 1000;
      let timeSetted = 0;
      if (mode == 0) {
        //解除锁定
        clearInterval(this.deadLineTimer);
        this.lock_all_pages = false;
      } else if (mode == 1) {
        let timeNow = new Date().getTime();
        timeSetted = time - timeNow > 0 ? time - timeNow : 0;
        if (timeSetted == 0) {
          this.lock_all_pages = true;
        }
      } else if (mode == 2) {
        timeSetted = time;
      }
      if (timeSetted > 0) {
        clearInterval(this.limitText);
        this.countDownMin = parseInt(timeSetted / 60 / 1000);
        this.limitText = setInterval(() => {
          this.countDownMin--;
          if (this.countDownMin <= 0) {
            clearInterval(this.limitText);
          }
        }, 60 * 1000);
        clearInterval(this.deadLineTimer);
        this.deadLineTimer = setInterval(() => {
          //触发deadline事件
          this.lock_all_pages = true;
          clearInterval(this.deadLineTimer);
        }, timeSetted);
        // 在beforeDestroy钩子触发时清除定时器
        this.$once("hook:beforeDestroy", () => {
          clearInterval(this.deadLineTimer);
        });
      }
    },
    joinRoom() {
      this.currentSo = createSo(
        this.slide_id,
        this.token,
        this.class_id,
        this.msgListener,
        () => {
          if (this.classRoomInfo?.status == "close") return;
          this.emitSo(
            "rename",
            `{"room": "${this.class_id}", "user_id": "${this.uid}", "token": "${this.token}","class_id":"${this.class_id}", "user_name_new": "${this.uname}"}`
          );
          // console.log(this.slides[this.currentPageIndex].page_id)
          this.emitSo(
            "go-to-page",
            `{"room": "${this.class_id}", "token": "${
              this.token
            }","class_id":"${this.class_id}", "params": {"page":"${
              this.slides[this.currentPageIndex].page_id
            }"}}`
          );
        },
        this.onLineStatusChanged,
        this.rejoinRoomAction
      );
      setStudentWxBaseParams({
        classId: this.class_id,
        uid: this.uid,
        token: this.token,
        uname: this.uname
      });
    },
    // 重连后要做的事情
    rejoinRoomAction() {
        getCurrentClassPageIndex(this.class_id)
        .then((data) => {
          if(data) {
            this.pageChange(parseInt(data.data), true);
          }
        })
    },
    msgListener(d) {
      // console.log(d, d.mtype, "====收到消息命令");
      // 收到切换页码命令
      if (d.mtype === SocketEventsEnum.CONTROL) {
        if (d.type == SocketEventsEnum.GO_PAGE) {
          const nextPageIndex = parseInt(d.params.page);
          console.log(this.currentPageIndex, nextPageIndex, '===new')
          if (this.currentPageIndex != nextPageIndex) {
            this.pageChange(nextPageIndex);
          }
        } else if (d.type == SocketEventsEnum.MODEL_CHANGE) {
          // console.log(d.type, "===收到的消息类型", d.params.mode);
          this.currentModel =
            d.params.mode === "student-paced"
              ? ClassRoomModelEnum.STUDENT_MODEL
              : ClassRoomModelEnum.TEACHER_MODEL;
          if (this.currentModel != ClassRoomModelEnum.STUDENT_MODEL) {
            this.lock_all_pages = false;
            this.hideStudentModal()
          } else if(this.studentPaceLastPage !== -1){
            // 如果切回到学生模式。要跳转到之前学生模式那一页
            this.pageChange(this.studentPaceLastPage)
          }
          this.$forceUpdate();
        } else if (d.type == SocketEventsEnum.CHANGE_SESSION_STATUS) {
          if (!this.classRoomInfo) return;
          this.classRoomInfo.status = d.params.status;
          this.$forceUpdate();
        } else if (d.type == SocketEventsEnum.LOCK_PAGE) {
          let locked = d.params.lock;
          let page = d.params.page;
          if (!this.classRoomInfo.lock_page) {
            this.classRoomInfo.lock_page = new Array();
          }
          if (locked) {
            this.classRoomInfo.lock_page.push(page);
          } else {
            this.classRoomInfo.lock_page = this.classRoomInfo.lock_page.filter(
              item => item != page
            );
          }
        } else if (d.type == SocketEventsEnum.SET_DEADLINE_TIME) {
          const { response_limit_mode, response_limit_time } = d.params;
          this.handleDeadLineEvent(response_limit_mode, response_limit_time);
        }
      } else if (d.mtype === SocketEventsEnum.TEACHER_COMMENT) {
        this.onGetTeacherComment(d);
      } else if (d.mtype === SocketEventsEnum.GET_COMMENT_ID) {
        // 获取发出的评论id，用于删除时候调用
        this.updateLatestRemarkId(d.id);
      } else if (d.mtype === SocketEventsEnum.STUDENT_ADD_MEDIA) {
        const index = this.slides.findIndex(item => d.page_id === item.page_id);
        this.slides[index].elements.push({ id: d.id, ...d.data });
        // console.log(this.allAddedMediaList, "STUDENT_ADD_MEDIA");
      } else if (d.mtype === SocketEventsEnum.TEACHER_UPDATE_MEDIA) {
        // this.slides[index].elements.push(d.data)
        // // console.log('this.allAddedMediaList', 'UPDATE_MEDIA_ELEMENT', d)
        // const {id} = d.data
        // const index = this.slides.findIndex(item => d.page_id === item.page_id)
        // const list = this.slides[index].elements
        // const itemIndex = list.findIndex(item => id === item.id)
        // this.slides[index].elements.splice(itemIndex, 1, d.data)
        // const page_id = this.currentPageId
        // this.slides[this.currentPageIndex].elements.push(d.data)
      } else if (d.mtype === SocketEventsEnum.TEACHER_DELETE_MEDIA) {
        // this.slides[index].elements.push(d.data)
        // console.log("this.allAddedMediaList", "UPDATE_MEDIA_ELEMENT", d);
        const { id } = d;
        const list = this.slides[this.currentPageIndex].elements;
        const itemIndex = list.findIndex(item => id == item.id);
        this.slides[this.currentPageIndex].elements.splice(itemIndex, 1);
      } else if (d.mtype === SocketEventsEnum.ANSWER_QUESTION) {
        this.updateAllAnswerdList(d);
      } else if (d.mtype === SocketEventsEnum.DELETE_QUESTION) {
        this.deleteOnAnswerById(d.response_id);
      } else if (d.mtype === SocketEventsEnum.UPDATE_TIP) {
        console.log(d);
        this.updateSlideItemTip(d);
        EventBus.$emit("set-unread-tip");
      } else if (d.mtype === SocketEventsEnum.UPDATE_RIGHT_ANSWERS) {
        console.log(d);
        if (d.page_id === this.currentItemData.page_id) {
          // 修改当前页答案
          EventBus.$emit("refresh-new-answer");
        }
        this.updateSlideCorrectAnswer(d);
      }
    },
    // 收到评论
    onGetTeacherComment(d) {
      const {
        item: { studentId },
        comment_id
      } = d;
      if (studentId === this.uid) {
        // 对比一下uid
        this.addStudentComment({
          ...d.item,
          id: comment_id
        });
      }
    },
    showStudentModal() {
      if (!this.studentCommentLoaded) {
        return showToast("data not ready", "warning");
      }
      if (!this.modalVisiable) {
        this.unread = false;
        readStudentComment();
        EventBus.$emit(ModalEventsNameEnum.SHOW_STUDENT_MODAL, true);
      } else if (this.unread) {
        // 打开状态下有更新
        EventBus.$emit(ModalEventsNameEnum.SHOW_STUDENT_MODAL_REFRESH);
      } else {
        EventBus.$emit(ModalEventsNameEnum.SHOW_STUDENT_MODAL, false);
      }
      this.modalVisiable = !this.modalVisiable;
    },
    hideStudentModal() {
      EventBus.$emit(ModalEventsNameEnum.SHOW_STUDENT_MODAL, false);
      this.modalVisiable = false;
    },
    showStudentQuestions() {
      // 与评论互斥, 需要关闭
      this.hideStudentModal();
      // this.questionModalVisiable = !this.questionModalVisiable;
    },
    answerChoice(v, locked, typeParam) {
      // console.log("change answer==" + v, this.currentSo);
      if (!typeParam || typeParam != "text") {
        const { page_id, items } = this.currentItemData;
        const { type } = items[0];
        // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
        this.emitSo(
          "response",
          `{"room": "${this.class_id}","user_name":"${this.uname}", "type":"${type}", "user_id": "${this.uid}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "item_1", "answer": "${v}", "locked": "${locked}"}`
        );
        saveStudentsCurrentPageAnswerList(page_id, type, {
          key: "item_1",
          answer: v,
          locked
        });
        this.updateAnswerdPage(this.currentPageIndex);
        this.currentAnswerd = true;
      } else if (typeParam && typeParam == "text") {
      }
      this.showCorrect = locked;
      this.$forceUpdate();
      // // this.allAnswers[pid] = v;
      // this.$set(this.allAnswers, pid, v);
      // // this.$forceUpdate()
      // // console.log(this.allAnswers, "====", this.allAnswers[this.currentPageId]);
    },
    emitSo(action, message) {
      this.checkCurrentAnswerd();
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        // // console.log(action, message);
        this.currentSo.emit(action, typeof message === 'object' ? JSON.stringify(message) : message);
      }
    },
    lastPage() {
      if (this.currentPageIndex > 0) {
        this.pageChange(this.currentPageIndex - 1);
      }
    },
    nextPage() {
      if (this.currentPageIndex < this.slides.length - 1) {
        this.pageChange(parseInt(this.currentPageIndex) + 1);
      }
    },
    isShowRightAnswer() {
      if (!this.slides || !this.slides[this.currentPageIndex]) {
        this.showCorrect = false;
        return false;
      }
      let data = this.slides[this.currentPageIndex];
      if (!data) {
        this.showCorrect = false;
        return false;
      }
      if (!data || !data.items || !data.items[0]) {
        this.showCorrect = false;
        return false;
      }
      if (data.items[0].type != "choice") {
        this.showCorrect = false;
        return false;
      }
      const result = this.getCurrentPageAnswer();
      if (result && result.length > 0) {
        const { answer, locked } = result[0];
        let checkedValues = JSON.parse(answer);
        this.showCorrect = locked && locked !== "false" ? true : false;
        if (this.showCorrect) {
          this.showCorrect = this.hasAnswer(data.items[0].data.options);
        }
        return this.showCorrect;
      }
      this.showCorrect = false;
      return false;
    },
    hasAnswer(opts) {
      for (let i = 0; i < opts.length; i++) {
        if (opts[i].isAnswer) return true;
      }
      return false;
    },
    getDeadLineStr(countDownTime) {
      if (countDownTime < 60) {
        return parseInt(countDownTime) + " min";
      } else if (countDownTime < 24 * 60) {
        return (
          parseInt(countDownTime / 60) +
          " hour/" +
          parseInt(countDownTime % 60) +
          " min"
        );
      } else {
        return (
          parseInt(countDownTime / (60 * 24)) +
          " day/" +
          parseInt((countDownTime % (60 * 24)) / 60) +
          " hour/" +
          parseInt((countDownTime % (60 * 24)) % 60) +
          " min"
        );
      }
    },
    hasS(count) {
      if (count > 1) return "s ";
      return " ";
    },
    showFullScreen(isFull) {
      this.fullScreen = isFull;
    },
    sendAudioOrVideoAnswer(link) {
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      this.link = link;
      // console.log("sendAudioOrVideoAnswer", page_id);
      this.emitSo(
        "response",
        {"room": this.class_id, "type":"media", "user_id": this.uid, "user_name":this.uname,"token": this.token,"class_id":this.class_id,  "page_id": page_id, "item_id": "0", "content":link}
      );
      saveStudentsCurrentPageAnswerList(page_id, type, {
        item_id: 0,
        key: 0,
        content: link
      });
      this.updateAnswerdPage(this.currentPageIndex);
      this.currentAnswerd = true;
    },
    changeShowMetrial(status) {
      this.meterialVisiable = status;
      this.metrialStatusMap[this.currentPageIndex] = status
    }
  }
};
</script>

<style lang="scss">
.custom-dialog.el-dialog {
  padding: 0;
  width: 520px;
  height: 600px;
  background-color: #f00fff00;
  border-radius: 8px;
  .el-dialog__header {
  }
  .el-dialog__body {
    padding: 0;
    height: 100%;
    width: 100%;
  }
}
</style>
<style scoped>
.website--content {
  width: 100%;
  height: 30px;
  display: flex;
  cursor: pointer;
  align-items: center;
}
.website--content:hover {
  background-color: #15983c;
  color: white;
}
#diycolor_comment {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: none;
  opacity: 0;
  transition: opacity 150ms linear;
  z-index: 9999;
}
.student-main {
  flex: 1;
  display: flex;
  padding-bottom: 5px;
  box-sizing: border-box;
  overflow: hidden;
}
.student-right {
  height: 100%;
  position: relative;
  background-color: rgba(211, 220, 230, 1);
}
.student-left {
  background-color: #f4f4f4;
  box-sizing: border-box;
  padding: 0;
  flex: 1;
}
.st-ppt-outer {
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.ppt-out-line {
  border: 1px solid #707070;
  box-shadow: 0px 10px 12px rgba(126, 126, 126, 0.16);
  box-sizing: border-box;
}
.icon {
  cursor: pointer;
  /* z-index: 999;
  position: fixed;
  top: 60px;
  right: 45%; */
}
.tip_area {
  cursor: pointer;
  position: fixed;
  top: 10px;
  right: 5%;
  z-index: 9999;
}

.web_site_icon {
  cursor: pointer;
  position: fixed;
  top: 10px;
  right: 10%;
  z-index: 9999;
  display: flex;
}
.tip_area_popover {
  cursor: pointer;
  z-index: 999;
  color: #313333;
  height: auto;
  position: fixed;
  top: 50px;
  right: 1%;
  border-radius: 5px;
  width: 200px;
  background-color: #ffffff;
  min-height: 50px;
  padding: 10px;
  box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
}
.deadline_info {
  background-color: red;
  opacity: 0.6;
  height: 43px;
  width: auto;
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  margin-left: 20px;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 5px;
}
.top_btn {
  height: 50px;
  width: auto;
  position: fixed;
  left: 20px;
  top: 0;
  align-items: center;
  display: flex;
  z-index: 999;
}
.online_status {
  width: 50px;
  height: 43px;
  font-size: 30px;
  line-height: 43px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  margin-right: 20px;
}
.page {
  width: 100%;
  height: 100%;
  padding-top: 50px;
  padding-bottom: 60px;
  box-sizing: border-box;
}
.student-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.block {
  width: 100%;
  height: 100%;
}
.scroll-student {
  max-height: 700px;
  background-color: #999;
  overflow-y: scroll;
}
.scroll-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: transparent;
  z-index: 99999;
}
.sfooter {
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #d9dfe4;
  color: #fff;
  z-index: 1999;
}
.sfooter div {
  margin: 0 20px;
}
.page_index {
  position: relative;
  flex: 1;
  padding-top: 20px;
}
.checkboxs {
  margin-right: 10px;
}
.website {
  width: 90%;
  height: 100%;
}
.readchat {
  font-size: 30px;
  cursor: pointer;
  display: flex;
}
.full_screen {
  background-color: #000000;
  opacity: 0.98;
  z-index: 99999;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>
