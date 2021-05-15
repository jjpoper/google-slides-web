<template>
  <div class="page">
    <class-room-closed
      v-if="classRoomInfo && classRoomInfo.status == 'close'"
      :class_id="classRoomInfo.class_id"
      :token="token"
    />
    <pageLockedNote
      v-else-if="classRoomInfo && isPageLocked()"
      :data="currentItemData"
      :answerList="answerList"
    />
    <el-container v-else>
      <el-main
        v-if="
          currentItemData &&
          currentItemData.thumbnail_url &&
          (!currentItemData.items[0] ||
          currentItemData.items[0].type !== 'draw')  
        "
      >
        <div
          class="block"
          v-if="currentItemData && currentItemData.thumbnail_url"
        >
          <pptcontent :url="currentItemData.thumbnail_url" />
        </div>
      </el-main>
      <el-aside
        :width="`${currentItemData.items[0].type !== 'draw' ? '40%' : '100%'}`"
        style="position: relative"
        v-if="currentItemData && currentItemData.items[0]"
      >
        <StudentsIndexItem
          :data="currentItemData"
          :type="currentItemData.items[0].type"
          :method="answerText"
          :answer="answerChoice"
          :sendCanvas="sendCanvas"
          :url="currentItemData.thumbnail_url"
        />
        <student-comment />
      </el-aside>

      <div class="sfooter" v-if="slides && slides.length > 0">
        <student-control-panel
          :lastPage="lastPage"
          :nextPage="nextPage"
          :currentPage="parseInt(currentIndex) + 1"
          :totalPage="slides.length"
          :currentModel="currentModel"
          :currentAnswerd="currentAnswerd"
          :unread="unread"
          :showStudentModal="showStudentModal"
        />
      </div>
    </el-container>
  </div>
</template>
<style scoped>
.page {
  width: 100%;
  height: 100%;
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
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0;
  background: #000000aa;
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
}
</style>
<script>
import pptcontent from "../components/pptcontent";
import {
  getAllPPTS,
  getStudentLoginUrl,
  getUserProfile,
  queryClassStatus,
} from "../model/index";
import {
  initStudentData
} from '@/model/data.student'
import {
  initStudentCommentData
} from '@/model/comment.student'
import { showLoading, hideLoading } from "../utils/loading";
import StudentsIndexItem from "../components/students/Index";
import { createSo } from "../socket/socket.student";
import {
  ModalEventsNameEnum,
  SocketEventsEnum,
  ClassRoomModelEnum,
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
} from "@/model/store.student";
import { MessageBox } from "element-ui";
import StudentComment from "@/components/students/studentComment.vue";
import ClassRoomClosed from "@/components/students/classRoomClosed.vue";
import studentControlPanel from "@/components/students/studentControlPanel.vue";
import pageLockedNote from "@/components/students/pageLockedNote.vue";
// import {checkGoogleAuth, gotoGoogleAuth, initGoogleAuth, getGoogleUserInfo} from '@/utils/googleAuth'

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
    };
  },
  mounted() {
    this.unread = getStudentCommentUnReadStatus();
  },
  components: {
    pptcontent,
    StudentsIndexItem,
    StudentComment,
    ClassRoomClosed,
    studentControlPanel,
    pageLockedNote,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const { slide_id, token, page } = to.query;
      console.log(page, "currentIndex");
      vm.slide_id = slide_id;
      vm.class_id = to.query.class_id;
      vm.currentIndex = page && page !== "undefined" ? page : 0;
      if (token) {
        vm.token = token;
        saveStudentStoreToken(token);
      } else {
        vm.token = getStudentStoreToken();
      }
      vm.initWithToken();
    });
  },
  methods: {
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
            this.getAllSlides();
          }
        });
      }
    },
    isPageLocked() {
      if (this.currentModel == ClassRoomModelEnum.STUDENT_MODEL) {
        return false;
      }
      if (!this.classRoomInfo.lock_page) {
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
    goToLogin() {
      getStudentLoginUrl().then((url) => {
        console.log(url);
        if (url) {
          location.href = url;
        }
      });
    },
    checkCurrentAnswerd() {
      if(this.currentItemData) {
        const { page_id, items } = this.currentItemData;
        if (items[0]) {
          this.answerList = getStudentCurrentPageAnswerList(
            page_id,
            items[0].type
          );
          console.log("list", this.answerList);
          this.currentAnswerd = this.answerList.length > 0;
        } else {
          this.currentAnswerd = false;
        }
      }
      
    },
    getAllSlides() {
      console.log('list', '========');
      initStudentCommentData(this.class_id, this.token)
      Promise.all([initStudentData(this.class_id, this.token), getAllPPTS(this.slide_id)]).then(([allA, list]) => {
        console.log(list, '========');
        this.slides = list;
        this.getItemData();
        hideLoading();
      });
    },
    sendCanvas(base64Url) {
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      saveStudentsCurrentPageAnswerList(page_id, type, {
        key: "item_1_canvas",
        content: base64Url,
      });
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"draw", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "0", "content":"${base64Url}"}`
      );
      this.currentAnswerd = true;
    },
    // 发送text
    answerText(index, msg) {
      console.log("index==" + index + "  msg==" + msg);
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"${type}", "user_id": "${this.uid}", "user_name":"${this.uname}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "${index}", "content":"${msg}"}`
      );
      saveStudentsCurrentPageAnswerList(page_id, type, {
        item_id: index,
        key: index,
        content: msg,
      });
      this.currentAnswerd = true;
    },
    getItemData() {
      this.currentItemData = null;
      this.$nextTick(() => {
        console.log(this.currentIndex, "getItemData");
        this.currentItemData = this.slides[this.currentIndex];
        this.checkCurrentAnswerd();
        // this.currentItemData = choice
        // if (choice && choice.data) {
        //   this.type = choice.type;
        //   console.log("currentType==" + this.type);
        //   this.currentData = choice.data
        //   const { title, options } = choice.data;
        //   this.title = title;
        //   this.options = options;
        // }
      });
    },
    pageChange(page) {
      console.log(page, "pageChange");
      this.currentIndex = page - 1;
      this.getItemData();
      // if (this.modalVisiable) {
      //   this.showStudentModal();
      //  }
    },
    afterLogin({ user_name, email }) {
      this.uname = user_name;
      this.uid = email;
      saveStudentUserName(this.uname);
      this.beforejoinRoom();
    },
    beforejoinRoom() {
      // const uname = getStudentUserName(this.uid);
      // console.log(uname, "uname");
      // this.uname = uname != "null" && uname != undefined ? uname : "";
      // if (!this.uname) {
      //   this.enterUname(true);
      // } else {
      //   this.joinRoom();
      // }
      queryClassStatus(this.class_id, this.token)
        .then((res) => {
          this.classRoomInfo = res;
          if (this.classRoomInfo.status == "live") {
            this.currentModel = ClassRoomModelEnum.TEACHER_MODEL;
          } else if (this.classRoomInfo.status == "student-paced") {
            this.currentModel = ClassRoomModelEnum.STUDENT_MODEL;
          }
          console.log(this.classRoomInfo);
        })
        .catch((res) => {
          console.log(res);
        });
      this.joinRoom();
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
        }
      );
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
              (item) => item != page
            );
          }
        }
      } else if (d.mtype === SocketEventsEnum.TEACHER_COMMENT) {
        this.onGetTeacherComment(d);
      }
    },
    // 收到评论
    onGetTeacherComment(d) {
      const {
        item: {
          studentId,
          pageId,
          itemId,
          title,
          time,
          value,
          teacherName,
          slideIndex,
        },
        user_id,
      } = d;
      if (user_id === this.uid) {
        // 对比一下uid
        addStudentComment(d.item);
        unreadStudentComment();
        this.unread = true;
      }
    },
    showStudentModal() {
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
    answerChoice(v) {
      console.log("change answer==" + v, this.currentSo);
      const { page_id, items } = this.currentItemData;
      const { type } = items[0];
      // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
      this.emitSo(
        "response",
        `{"room": "${this.class_id}", "type":"${type}", "user_id": "${this.uid}","token": "${this.token}","class_id":"${this.class_id}",  "page_id": "${page_id}", "item_id": "item_1", "answer": "${v}"}`
      );
      saveStudentsCurrentPageAnswerList(page_id, type, {
        key: "item_1",
        answer: v,
      });
      this.currentAnswerd = true;
      // // this.allAnswers[pid] = v;
      // this.$set(this.allAnswers, pid, v);
      // // this.$forceUpdate()
      // console.log(this.allAnswers, "====", this.allAnswers[this.currentPageId]);
    },
    emitSo(action, message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        // console.log(action, message);
        this.currentSo.emit(action, message);
      }
    },
    enterUname(status) {
      MessageBox.prompt("enter a new name", "enter a new name", {
        confirmButtonText: "确定",
        showCancelButton: false,
        showClose: false,
      })
        .then(({ value }) => {
          if (!value) value = this.uid;
          this.uname = value;
          saveStudentUserName(value);
          if (status) {
            this.joinRoom();
          } else {
            this.emitSo(
              "rename",
              `{"room": "${this.class_id}", "user_id": "${this.uid}","token": "${this.token}","class_id":"${this.class_id}", "user_name_new": "${value}"}`
            );
          }
        })
        .catch(() => {});
    },
    lastPage() {
      console.log(this.currentIndex);
      if (this.currentIndex > 0) {
        this.pageChange(this.currentIndex);
      }
    },
    nextPage() {
      console.log(this.currentIndex, this.currentIndex + 2, "nextpage");
      if (this.currentIndex < this.slides.length - 1) {
        this.pageChange(parseInt(this.currentIndex) + 2);
      }
    },
  },
};
</script>