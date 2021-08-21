<template>
  <div class="page" v-if="slides && slides.length">
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

    <div style="width: 100%; height: 100%" v-else>
      <!-- <student-questions
        v-if="questionModalVisiable"
        :sendQuestion="sendQuestion"
        :list="filterMarkupList"
        :url="currentItemData && currentItemData.thumbnail_url"
        :pageId="slides[currentIndex].page_id"
        :delQuestion="delQuestion"
      /> -->

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
          />
        </div>
        <div
          class="student-left"
          v-if="
            currentItemData &&
            currentItemData.thumbnail_url &&
            (!currentItemData.items[0] ||
              currentItemData.items[0].type !== 'draw')
          "
        >
          <div class="st-ppt-outer">
            <pptcontent
              class="ppt-out-line"
              v-if="currentItemData && currentItemData.thumbnail_url"
              :url="currentItemData.thumbnail_url"
              :filterAddedMediaList="filterAddedMediaList"
              :meterialVisiable="meterialVisiable"
            />
          </div>
        </div>
        <div
          class="student-right"
          :style="`width: ${getWidthPercent(currentItemData.items[0].type)}`"
          v-if="currentItemData && currentItemData.items[0]"
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
            :currentIndex="parseInt(currentIndex)"
            :slides="slides"
            :hidePropsStudentModal="hideStudentModal"
          />
        </div>

        <div class="sfooter" v-if="slides && slides.length > 0">
          <student-control-panel
            :lastPage="lastPage"
            :nextPage="nextPage"
            :totalPage="slides.length"
            :currentModel="currentModel"
            :unread="unread"
            :showStudentModal="showStudentModal"
            :isShowQuestion="isShowQuestion"
            :changeShowOrAnswer="changeShowOrAnswer"
            :fullScreenWidth="screenWidth"
            :screenWidth="currentScreenWidth"
            :smallWindow="smallWindow"
            :changeShowMetrial="changeShowMetrial"
          />
        </div>
      </div>
    </div>

    <div class="top_btn">
      <div class="online_status">
        <i class="el-icon-s-opportunity" :style="`color: ${onLine ? 'green' : 'red'}`" />
      </div>
      <div
        class="deadline_info"
        v-if="showRemainTime()"
      >Deadline time remain: {{ getDeadLineStr(countDownMin) }}</div>
      <el-tooltip content="mark up and send comment" placement="top">
        <div class="readchat comment">
          <!-- <el-switch
            style="display: block"
            v-model="questionModalVisiable"
            active-color="#13ce66"
            inactive-color="#999"
            @change="showStudentQuestions"
            active-text="comment"
          ></el-switch>
          <el-switch
            style="display: block; margin-left: 10px"
            v-model="overviewModalVisiable"
            active-color="#13ce66"
            inactive-color="#999"
            active-text="overview slides"
          ></el-switch>-->
        </div>
      </el-tooltip>
      <div
        class="deadline_info"
        v-if="showRemainTime()"
      >Deadline time remain:{{ countDownMin }} mintues.</div>

      <div class="deadline_info" v-if="showCorrect">You are unable to change your answer</div>
    </div>
    <svg
      t="1623813115939"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2481"
      width="40"
      height="40"
      v-if="
        !fullScreen &&
        !smallWindow &&
        !questionModalVisiable &&
        currentItemData &&
        currentItemData.thumbnail_url &&
        currentItemData.items[0] &&
        currentItemData.items[0].type !== 'draw'
      "
      @click="showFullScreen(true)"
    >
      <path
        d="M629.557 391.972c17.329 17.32 47.028 17.32 66.815 0l168.302-165.814v133.637c0 19.806 14.85 34.647 34.637 34.647h24.743c19.806 0 34.657-12.372 34.657-29.692V119.733h-2.479l2.479-17.318c0-9.904-2.479-17.33-7.436-24.752-4.936-4.948-14.848-9.895-24.743-9.895h-17.327L664.211 65.29c-19.805 0-34.654 17.329-34.654 34.646v24.752c2.478 22.274 19.789 34.646 39.593 34.646h128.69L632.036 325.149c-22.283 17.319-22.283 47.026-2.478 66.823zM394.44 629.557c-17.31-17.327-47.009-17.327-66.815 0l-168.3 165.807V664.195c0-19.787-14.833-34.638-34.638-34.638h-24.76c-19.788 0-34.639 12.372-34.639 29.699v242.533h2.478l-2.478 17.327c0 9.894 2.478 17.31 7.416 24.744 4.956 4.956 14.868 9.894 24.761 9.894h17.328l244.993 2.478c19.823 0 34.655-17.328 34.655-34.638v-24.76c-2.478-22.266-19.788-34.638-39.593-34.638H226.16l168.283-165.824c17.327-17.327 17.327-47.027-0.001-66.815z m561.79 274.709v-242.55c0-19.787-17.329-29.68-34.639-29.68h-24.759c-19.788 0-34.639 17.31-34.639 34.638v131.168l-168.3-165.806c-17.309-17.329-47.01-17.329-66.816 0-17.326 17.31-17.326 47.009 0 66.814l168.284 165.806h-128.69c-19.787 0-37.116 12.388-39.594 34.654v24.745c0 19.805 17.33 34.654 34.64 34.654l240.071-2.478h17.329c9.893 0 17.31-2.478 24.743-9.894 4.955-4.956 7.415-14.85 7.415-24.744l4.955-17.327c-2.478 0 0 0 0 0zM228.636 159.335h128.69c19.806 0 37.116-12.373 39.593-34.646V99.936c0-19.797-17.309-34.646-34.654-34.646l-244.993 2.478H99.927c-9.876 0-17.31 2.478-24.743 9.895-4.939 4.956-7.416 14.849-7.416 24.752l2.477 17.318h-2.477v245.018c0 19.797 14.85 29.692 34.638 29.692h24.743c19.823 0 34.655-14.841 34.655-34.646v-133.64l168.283 165.815c17.345 17.32 47.045 17.32 66.832 0 17.33-17.327 17.33-47.026 0-66.823L228.636 159.335z m0 0"
        p-id="2482"
        fill="#1296db"
      />
    </svg>
    <div id="diycolor_comment"></div>
  </div>
</template>
<script>
import pptcontent from "../components/pptcontent";
import {
  getAllPPTS,
  getStudentLoginUrl,
  getUserProfile,
  queryClassStatus,
  getAVComment
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
  addStudentComment,
  unreadStudentComment,
  getStudentCommentUnReadStatus,
  readStudentComment,
  getStudentStoreToken,
  saveStudentStoreToken,
  initStudentStoreSlideId
} from "@/model/store.student";
import { MessageBox } from "element-ui";
import StudentComment from "@/components/students/studentComment.vue";
import ClassRoomClosed from "@/components/students/classRoomClosed.vue";
import studentControlPanel from "@/components/students/studentControlPanel.vue";
import pageLockedNote from "@/components/students/pageLockedNote.vue";
import StudentQuestions from "@/components/students/studentQuestions.vue";
import colorSelector from "@/utils/color";
import TipsList from "@/components/common/tipsList.vue";

import { mapActions } from "vuex";

export default {
  data() {
    return {
      pptUrl: null,
      title: "",
      options: [],
      slides: [],
      currentIndex: 0,
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
      firstJoined: true
    };
  },
  computed: {
    filterAddedMediaList() {
      if (this.slides[this.currentIndex]) {
        return this.slides[this.currentIndex].elements.filter(
          item => item.type !== "tip" && item.position
        );
      } else {
        return [];
      }
    },
    filterTips() {
      if (this.slides[this.currentIndex]) {
        return this.slides[this.currentIndex].elements.filter(
          item => item.type === "tip"
        );
      } else {
        return [];
      }
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
    pptcontent,
    StudentsIndexItem,
    StudentComment,
    ClassRoomClosed,
    studentControlPanel,
    pageLockedNote,
    StudentQuestions,
    TipsList
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { id } = vm.$route.params;
      const { token, p } = to.query;
      vm.class_id = id;
      vm.currentIndex = to.query.p ? to.query.p : 0;
      initStudentStoreSlideId(id);
      if (token) {
        vm.token = token;
        saveStudentStoreToken(token);
      } else {
        vm.token = getStudentStoreToken();
      }
      vm.initWithToken();
    });
  },
  watch: {
    currentIndex() {
      console.log("set elements");
      if(this.slides && this.slides[this.currentIndex]) {
        this.setElements(this.slides[this.currentIndex].elements);
      }
      this.setStudentPageIndex(this.currentIndex)
    },
    slides() {
      console.log("set elements");
      this.setElements(this.slides[this.currentIndex].elements);
    }
  },
  methods: {
    ...mapActions("student", [
      "setElements",
      "setStudentPageIndex",
      "setStudentAllSlides",
      "setStudentUserInfo",
      "updateAnswerdPage",
      "setAllAnswerdList"
    ]),
    ...mapActions("remark", [
      "showRemarkModal",
      "setAllRemarkList",
      "updateLatestRemarkId"
    ]),
    loadDiyPainter() {
      this.$nextTick(() => {
        const selector = document.getElementById("diycolor_comment");
        console.log(selector, "selector");
        colorSelector.init(selector);
      });
    },
    changeShowOrAnswer() {
      this.isShowQuestion = !this.isShowQuestion;
    },
    getWidthPercent(type) {
      // if (this.questionModalVisiable) return "30%";
      if (type === "draw") return "100%";
      if (type === "website") return "70%";
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
      if (!this.slides[this.currentIndex]) {
        return false;
      }
      if (!this.classRoomInfo || !this.classRoomInfo.lock_page) {
        return false;
      } else {
        for (let i = 0; i < this.classRoomInfo.lock_page.length; i++) {
          if (
            this.classRoomInfo.lock_page[i] ==
            this.slides[this.currentIndex].page_id
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
        console.log(url);
        if (url) {
          location.href = url;
        }
      });
    },
    getCurrentPageAnswer() {
      const { page_id, items } = this.currentItemData;
      const type = items[0].type
      if(type !== 'comment') {
        return getStudentCurrentPageAnswerList(
            page_id,
            type
          )
      } else {
        // comment remark 特殊，数据不在answer内
        return this.$store.state.remark.allRemarks.filter(item => item.page_id === page_id)
      }
    },
    checkCurrentAnswerd() {
      if (this.currentItemData) {
        const { items } = this.currentItemData;
        if (items[0]) {
          this.answerList = this.getCurrentPageAnswer()
          this.currentAnswerd = this.answerList.length > 0;
          if (this.currentAnswerd) {
            this.updateAnswerdPage(this.currentIndex)
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
      console.log("list", "========");
      initStudentCommentData(this.class_id, this.token).then(() => {
        this.studentCommentLoaded = true;
      });
      Promise.all([
        initStudentData(this.class_id, this.token),
        getAllPPTS(this.slide_id)
      ]).then(([allA, { pages: list }]) => {
        console.log(list, "========");
        // vuex缓存答案
        this.setAllAnswerdList(allA)
        this.slides = list;
        // vuex 缓存全局slides
        this.setStudentAllSlides(list)
        this.getItemData();
        hideLoading();
        this.loadDiyPainter();
      });
    },
    sendCanvas(base64Url, texturl) {
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      saveStudentsCurrentPageAnswerList(page_id, type, {
        key: "item_1_canvas",
        content: base64Url
      });
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"draw", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "0", "content":"${base64Url}","content1":"${texturl}"}`
      );
      this.updateAnswerdPage(this.currentIndex)
      this.currentAnswerd = true;
    },
    sendDrawText(textContent) {
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"draw_text", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "0", "content":${textContent}}`
      );
      this.updateAnswerdPage(this.currentIndex)
      this.currentAnswerd = true;
    },
    // 发送text
    answerText(index, msg, show) {
      console.log("index==" + index + "  msg==" + msg);
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"${type}", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "${index}", "content":"${msg}","locked": ${show}}`
      );
      saveStudentsCurrentPageAnswerList(page_id, type, {
        item_id: index,
        key: index,
        content: msg
      });
      this.updateAnswerdPage(this.currentIndex)
      this.currentAnswerd = true;
    },
    getItemData() {
      this.currentItemData = null;
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentIndex];
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
          console.log("学生go-to-page");
          this.emitSo(
            "go-to-page",
            `{"room": "${this.class_id}", "token": "${
              this.token
            }","class_id":"${this.class_id}", "params": {"page":"${
              this.slides[this.currentIndex].page_id
            }"}}`
          );
        }
      });
    },
    pageChange(page) {
      console.log(page, "pageChange", this.currentIndex);
      const nextPage = page - 1;
      if(this.currentIndex != nextPage) {
        this.currentIndex = nextPage;
        this.getItemData();
        this.isShowRightAnswer();
        this.isShowQuestion = true;
      } else {
        console.log('已是当前页码，不用切换', "pageChange");
      }
    },
    afterLogin({ user_name, email }) {
      this.uname = user_name;
      this.uid = email;
      this.setStudentUserInfo({
        name: user_name,
        uid: email
      })
      saveStudentUserName(this.uname);
      this.beforejoinRoom();
    },
    initRoomConfig(res) {
      this.slide_id = res.slide_id;
      // this.currentIndex = 0;
    },
    beforejoinRoom() {
      queryClassStatus(this.class_id, this.token)
        .then(res => {
          this.classRoomInfo = res;
          console.log(this.classRoomInfo);
          this.initRoomConfig(res);
          this.afterConnectRoom();
        })
        .catch(res => {
          console.log(res);
        });
    },
    afterConnectRoom() {
      this.joinRoom();
      this.getAllSlides();
      getAVComment(this.class_id, this.token)
        .then(res => {
          console.log(res);
          if (res.code == "ok") {
            let marks = []
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].data.fromServie = true; //从服务器处获取
              res.data[i].data.id = res.data[i].id;
              marks.push(res.data[i].data);
            }
            // 初始化remark数据
            this.setAllRemarkList(marks)
          }
        })
        .catch(res => {
          console.log(res);
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
          if (this.classRoomInfo?.status == "close") renturn;
          this.emitSo(
            "rename",
            `{"room": "${this.class_id}", "user_id": "${this.uid}", "token": "${this.token}","class_id":"${this.class_id}", "user_name_new": "${this.uname}"}`
          );

          this.emitSo(
            "go-to-page",
            `{"room": "${this.class_id}", "token": "${
              this.token
            }","class_id":"${this.class_id}", "params": {"page":"${
              this.slides[this.currentIndex].page_id
            }"}}`
          );
        },
        this.onLineStatusChanged
      );
      setStudentWxBaseParams({
        classId: this.class_id,
        uid: this.uid,
        token: this.token,
        uname: this.uname
      })
    },
    msgListener(d) {
      console.log(d, d.mtype, "====收到消息命令");
      // 收到切换页码命令
      if (d.mtype === SocketEventsEnum.GO_PAGE) {
        if (d.type == SocketEventsEnum.GO_PAGE) {
          this.pageChange(parseInt(d.params.page) + 1);
        } else if (d.type == SocketEventsEnum.MODEL_CHANGE) {
          console.log(d.type, "===收到的消息类型", d.params.mode);
          this.currentModel =
            d.params.mode === "student-paced"
              ? ClassRoomModelEnum.STUDENT_MODEL
              : ClassRoomModelEnum.TEACHER_MODEL;
          if (this.currentModel != ClassRoomModelEnum.STUDENT_MODEL) {
            this.lock_all_pages = false;
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
        this.updateLatestRemarkId(d.id)
      } else if (d.mtype === SocketEventsEnum.STUDENT_ADD_MEDIA) {
        const index = this.slides.findIndex(item => d.page_id === item.page_id);
        this.slides[index].elements.push({ id: d.id, ...d.data });
        console.log(this.allAddedMediaList, "STUDENT_ADD_MEDIA");
      } else if (d.mtype === SocketEventsEnum.TEACHER_UPDATE_MEDIA) {
        // this.slides[index].elements.push(d.data)
        // console.log('this.allAddedMediaList', 'UPDATE_MEDIA_ELEMENT', d)
        // const {id} = d.data
        // const index = this.slides.findIndex(item => d.page_id === item.page_id)
        // const list = this.slides[index].elements
        // const itemIndex = list.findIndex(item => id === item.id)
        // this.slides[index].elements.splice(itemIndex, 1, d.data)
        // const page_id = this.currentPageId
        // this.slides[this.currentIndex].elements.push(d.data)
      } else if (d.mtype === SocketEventsEnum.TEACHER_DELETE_MEDIA) {
        // this.slides[index].elements.push(d.data)
        console.log("this.allAddedMediaList", "UPDATE_MEDIA_ELEMENT", d);
        const { id } = d;
        const list = this.slides[this.currentIndex].elements;
        const itemIndex = list.findIndex(item => id === item.id);
        this.slides[this.currentIndex].elements.splice(itemIndex, 1);
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
        addStudentComment({
          ...d.item,
          id: comment_id
        });
        unreadStudentComment();
        this.unread = true;
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
      console.log("change answer==" + v, this.currentSo);
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
          answer: v
        });
        this.updateAnswerdPage(this.currentIndex)
        this.currentAnswerd = true;
      } else if (typeParam && typeParam == "text") {
      }
      this.showCorrect = locked;
      this.$forceUpdate();
      // // this.allAnswers[pid] = v;
      // this.$set(this.allAnswers, pid, v);
      // // this.$forceUpdate()
      // console.log(this.allAnswers, "====", this.allAnswers[this.currentPageId]);
    },
    emitSo(action, message) {
      this.checkCurrentAnswerd();
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        // console.log(action, message);
        this.currentSo.emit(action, message);
      }
    },
    lastPage() {
      if (this.currentIndex > 0) {
        this.pageChange(this.currentIndex);
      }
    },
    nextPage() {
      if (this.currentIndex < this.slides.length - 1) {
        this.pageChange(parseInt(this.currentIndex) + 2);
      }
    },
    isShowRightAnswer() {
      if (!this.slides || !this.slides[this.currentIndex]) {
        this.showCorrect = false;
        return false;
      }
      let data = this.slides[this.currentIndex];
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
        this.showCorrect = locked === "true" ? true : false;
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
      console.log("sendAudioOrVideoAnswer", page_id);
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"media", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "0", "content":"${link}"}`
      );
      saveStudentsCurrentPageAnswerList(page_id, type, {
        item_id: 0,
        key: 0,
        content: link
      });
      this.updateAnswerdPage(this.currentIndex)
      this.currentAnswerd = true;
    },
    changeShowMetrial(status) {
      this.meterialVisiable = status;
    }
  }
};
</script>
<style scoped>
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
.student-main{
  width: 100%;
  height: 100%;
  display: flex;
  padding-bottom: 5px;
  box-sizing: border-box;
}
.student-right{
  height: 100%;
  position: relative;
  background-color: rgba(211, 220, 230, 1);
}
.student-left{
  background-color: #F4F4F4;
  box-sizing: border-box;
  padding: 0;
  flex: 1
}
.st-ppt-outer{
  width: 100%;
  height: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}
.ppt-out-line{
  border: 1px solid #707070;
  box-shadow: 0px 10px 12px rgba(126, 126, 126, 0.16);
  box-sizing: border-box;
}
.icon {
  cursor: pointer;
  z-index: 999;
  position: fixed;
  top: 60px;
  right: 45%;
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
  z-index: 9999;
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