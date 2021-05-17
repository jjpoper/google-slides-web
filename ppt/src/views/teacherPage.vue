<template>
  <div class="page">
    <div class="content" v-if="currentItemData">
      <TeacherPPTPage
        v-if="!isDashboard && currentItemData"
        class="pptContent"
        :currentItemData="currentItemData"
        :showResponse="showResponse"
        :currentAnswerCount="currentAnswerCount"
        :responseContentList="responseContentList"
      />

      <DashboardPage
        class="pptContent"
        :currentItemData="currentItemData"
        :showResponse="showResponse"
        :currentAnswerCount="currentAnswerCount"
        :responseContentList="responseContentList"
        :responsePercentage="responsePercentage"
        :isFocus="isFocus"
        :slides="slides"
        :giveFocus="giveFocus"
        v-else-if="currentItemData && slides"
      />
    </div>

    <!-- :changePage="giveFocus" -->
    <div class="control">
      <teacher-control-panel
        v-if="classRoomInfo"
        :current_model="page_model"
        :currentPage="parseInt(currentIndex) + 1"
        :totalPage="slides.length"
        :isDashboard="isDashboard"
        :changePage="pageChange"
        :turnModel="turnModel"
        :open="open"
        :showResponse="showres"
        :current_response="currentAnswerCount"
        :isResponseShow="showResponse"
        :slide_id="slide_id"
        :endLesson="endLesson"
        :turnOff="turnModel"
        :isClosed="classRoomInfo.status == 'close'"
        :classRoomInfo="classRoomInfo"
        :lockPage="lockPage"
        :slides="slides"
        :openProject="openProject"
        :reopenClass="_reopenClass"
      />
    </div>

    <comment-modal />
    <div class="top_btn">
      <div class="share_room" @click="copyUrl()">Share Class</div>

      <div
        class="number_info"
        @click="showStudents()"
      >Class Roster {{ getStudentOnLineCount() }}/{{ studentCounts }}</div>
    </div>

    <el-dialog title="Ending Session" :visible.sync="dialogVisible">
      <div class="dialog_page">
        <strong>
          Your session is currently in Student-Paced Mode. Are you sure you want
          to end your session?
        </strong>

        <div class="opts">
          <el-button type="danger" @click="leavePage()" class="leave_btn">
            <b>Leave and Allow Students To Keep Working</b>
          </el-button>

          <el-button class="confirm_btn" @click="endLesson(true)">
            <b>Yes,I'm sure!</b>
          </el-button>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      v-if="classRoomInfo"
      :title="
        classRoomInfo.class_name != 'unnamed'
          ? 'End Session ' + classRoomInfo.class_name
          : 'End This Session'
      "
      :visible.sync="confirmCloseDialogVisible"
    >
      <confirm-end-dialog
        v-if="classRoomInfo"
        :class_name="classRoomInfo.class_name"
        :cancelEndClass="cancelEndClass"
        :endClassroom="endClassroom"
      />
    </el-dialog>

    <el-dialog title="Classroom Roster" :visible.sync="dialogTableVisible">
      <studentList :teacherList="teacherList" :studentList="studentList" />
    </el-dialog>

    <el-dialog
      title="Wellcom to the Teacher Dashboard!"
      :visible.sync="stepOneDialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <stepOneView :openTwo="openTwo" />
    </el-dialog>

    <el-dialog title="This Session is in Student-Paced Mode" :visible.sync="stepTwoDialog">
      <stepTwoView :copyUrl="copyUrl" :closeTwo="closeTwo" />
    </el-dialog>
  </div>
</template>


<style scoped>
.page {
  width: 100%;
  height: 100%;
}
.content {
  width: 100%;
  height: 100%;
  background-color: #e0e0e0;
}
.control {
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0%;
  left: 0%;
  background-color: #000000af;
}
.top_btn {
  height: 30px;
  width: auto;
  position: fixed;
  right: 20px;
  top: 20px;
  display: flex;
}
.share_room {
  width: 100px;
  height: 30px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 5px;
  padding-top: 13px;
  cursor: pointer;
  margin-right: 20px;
  font-size: 14px;
}

.number_info {
  width: 150px;
  height: 30px;
  background-color: #409eff;
  color: white;
  font-size: 14px;
  border-radius: 5px;
  text-align: center;
  padding-top: 13px;
  cursor: pointer;
}

.dialog_page {
  display: flex;
  flex-direction: column;
}

.opts {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 20px;
}
.leave_btn {
  color: #ffffff;
}
.confirm_btn {
  color: #000000;
  margin-right: 20px;
}
.pptContent {
  height: 100%;
  width: 100%;
}
</style>

<script>
import copy from "copy-to-clipboard";
import {
  getAllPPTS,
  getTeacherLoginUrl,
  getUserProfile,
  requestRefreshPPT,
  queryRefreshResult,
  queryClassStatus,
  endClassRoomReq,
  reopenClass,
  getOnlineUsers
} from "../model/index";
import {
  initTeacherData,
  getTeacherCurrentPageAnswerList,
  addTeacherData
} from "@/model/data.teacher";
import { initTeacherCommentData } from "@/model/comment.teacher";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import { createSo } from "../socket/socket.teacher";
import {
  ModalEventsNameEnum,
  SocketEventsEnum,
  ClassRoomModelEnum
} from "../socket/socketEvents";
import {
  getTeacherStoreToken,
  saveTeacherStoreToken,
  saveAnswerList
} from "@/model/store.teacher";
import teacherControlPanel from "../components/teacher/teacherControlPanel";
import ConfirmEndDialog from "@/components/teacher/confirmEndDialog.vue";
import CommentModal from "@/components/teacher/commentModal.vue";
import TeacherPPTPage from "@/components/teacher/teacherPPTPage.vue";
import DashboardPage from "@/components/teacher/dashboardPage.vue";
import stepOneView from "../components/teacher/openDashboardStepOne";
import stepTwoView from "../components/teacher/openDashboardStepTwo";
import studentList from "../components/teacher/studentList";
export default {
  components: {
    teacherControlPanel,
    ConfirmEndDialog,
    CommentModal,
    TeacherPPTPage,
    DashboardPage,
    stepOneView,
    stepTwoView,
    studentList
  },

  /*author: "yujj085@gmail.com"
class_id: "6260a74965e66dbb"
class_name: "unnamed"
date: 1620784378
file_name: "ClasscipeDev"
id: 10
lock_page: null
slide_id: "1-oo7FBGrusK0UulTEA4OQpFo_rMWFsrq9cOEEMLNFzM"
status: "live"
type: "slide"*/

  data() {
    return {
      showResponse: false, // 默认不展示老师的回答
      studentCounts: 0,
      slides: [],
      currentIndex: 0,
      slide_id: 0,
      currentSo: null,
      uid: "", // uid
      currentItemData: null,
      currentAnswerCount: 0,
      name: "",
      googleLoginStatus: 0, // 0 未知， -1 登录， 1 登录
      dialogTableVisible: false,
      teacherList: [],
      studentList: [],
      current_page: 0,
      responseContentList: [],
      page_model: ClassRoomModelEnum.TEACHER_MODEL,
      token: "",
      dialogVisible: false,
      class_id: "",
      classRoomInfo: null,
      isLocked: false,
      confirmCloseDialogVisible: false,
      isDashboard: false,
      //dishboard
      responsePercentage: [],
      isFocus: [],
      stepOneDialog: false,
      stepTwoDialog: false,
      onLine: false, // 在线状态
      directFromPlugin: false //是否是从插件直接打开的。
    };
  },
  mounted() {
    EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, data => {
      this.sendComment(data);
    });

    EventBus.$on(
      ModalEventsNameEnum.SHOW_STAR_ANSWER,
      ({ pageId, itemId, title, studentId, nextStatus, type }) => {
        this.handleStarOrHide(
          pageId,
          itemId,
          title,
          studentId,
          nextStatus,
          type,
          true
        );
      }
    );
  },
  computed: {
    currentPageId() {
      if (this.slides[this.currentIndex]) {
        return this.slides[this.currentIndex].page_id;
      } else {
        return "p";
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { slide_id, token, class_id, type } = to.query;
      vm.slide_id = slide_id;
      vm.class_id = class_id;
      window.classId = class_id;
      vm.currentIndex = to.query.currentPage ? to.query.currentPage : 0;
      vm.isDashboard = type === "dashboard";
      vm.directFromPlugin = to.query.direct ? true : false;
      if (token) {
        vm.token = token;
        saveTeacherStoreToken(token);
      } else {
        vm.token = getTeacherStoreToken();
      }
      vm.initWithToken();
    });
  },

  methods: {
    onLineStatusChanged(status) {
      this.onLine = status
    },
    handleStarOrHide(
      pageId,
      itemId,
      title,
      studentId,
      nextStatus,
      type,
      sendWSMsg
    ) {
      if (this.currentPageId != pageId) {
        return;
      }
      let i = 0;
      for (; i < this.responseContentList.length; i++) {
        if (
          (this.responseContentList[i].item_id == itemId ||
            this.responseContentList[i].answer == itemId ||
            this.responseContentList[i].key == itemId) &&
          this.responseContentList[i].user_id == studentId
        ) {
          if (type == "star") {
            this.responseContentList[i].star = nextStatus;
          } else if (type == "show") {
            this.responseContentList[i].show = nextStatus;
          }

          //
          if (this.currentItemData.items[0]) {
            console.log(this.responseContentList[i].star, "star or hide!!!!");
            saveAnswerList(
              this.currentPageId,
              this.currentItemData.items[0].type,
              this.responseContentList
            );
            if (this.currentItemData.items[0].type == "choice") {
              const user_id = studentId;
              const answer = itemId;
              addTeacherData(
                this.currentPageId,
                this.currentItemData.items[0].type,
                {
                  user_id,
                  answer,
                  star: this.responseContentList[i].star,
                  show: this.responseContentList[i].show,
                  key: user_id
                }
              );
              EventBus.$emit("choice", { user_id, answer });
            } else if (this.currentItemData.items[0].type == "draw") {
              const user_id = studentId;
              const content = this.responseContentList[i].content;
              const user_name = this.responseContentList[i].user_name;
              EventBus.$emit("draw", { user_id, content, user_name });
            }
          }
          //发送一个ws消息通知其他端，更新状态
          if (sendWSMsg) {
            this.emitSo(
              `{"room":"${this.class_id}", "type": "${SocketEventsEnum.STAR_OR_HIDE_ANSWER}","token": "${this.token}","class_id":"${this.class_id}", 
              "params": {"pageId": "${pageId}","itemId": "${itemId}","studentId": "${studentId}","nextStatus": ${nextStatus},"type": "${type}"}}`
            );
          }
          break;
        }
      }
    },
    sendComment({
      studentId,
      pageId,
      itemId,
      title,
      time,
      value,
      teacherName
    }) {
      const itemData = JSON.stringify({
        type: SocketEventsEnum.TEACHER_COMMENT,
        studentId,
        pageId,
        itemId,
        title,
        time,
        value,
        teacherName,
        slideIndex: this.currentIndex + 1,
        room: this.slide_id
      });
      console.log(itemData);
      this.currentSo.emit(
        "comment",
        `{"user_id":"${studentId}","token": "${this.token}","class_id":"${this.class_id}", "item": ${itemData}}`
      );
      // this.currentSo.emit('comment', `{"user_id":"${studentId}", "item": {"id":"item_1", "response_index": 0}}`, data => {console.log("发送消息反馈")});
      // this.emitSo(itemData)
    },

    // 检查token
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
    goToLogin() {
      getTeacherLoginUrl().then(url => {
        console.log(url);
        if (url) {
          location.href = url;
        }
      });
    },
    afterLogin({ user_name, email }) {
      this.name = user_name;
      window.currentTeacherName = user_name;
      this.uid = email;
      this.startConnectRoom();
    },
    startConnectRoom() {
      this.joinRoom();
      queryClassStatus(this.class_id, this.token)
        .then(res => {
          this.classRoomInfo = res;
          if (this.classRoomInfo.status == "live") {
            this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
            if (this.directFromPlugin) {
              this.page_model = ClassRoomModelEnum.STUDENT_MODEL;
              this.emitSo(
                `{"room":"${this.class_id}", "type": "${
                  SocketEventsEnum.MODEL_CHANGE
                }", "token": "${this.token}","class_id":"${
                  this.class_id
                }","params": {"mode": "${
                  this.page_model === ClassRoomModelEnum.TEACHER_MODEL
                    ? "insturctor-paced"
                    : "student-paced"
                }"}}`
              );
            }
          } else if (this.classRoomInfo.status == "student-paced") {
            this.page_model = ClassRoomModelEnum.STUDENT_MODEL;
          }

          console.log(this.classRoomInfo);
        })
        .catch(res => {
          console.log(res);
        });

      requestRefreshPPT(this.slide_id, this.token)
        .then(res => {
          // console.log(res);
          if (res.data.task_id) {
            let code = res.data.task_id;
            this.queryResult(code, this.token, 0);
          } else {
            this.getAllSlides();
            hideLoading();
          }
        })
        .catch(res => {
          console.log(res, "net request error!!");
          this.getAllSlides();
          hideLoading();
        });
      getOnlineUsers(this.token, this.class_id)
        .then(res => {})
        .catch(res => {});
    },
    joinRoom() {
      this.currentSo = createSo(
        this.slide_id,
        this.token,
        this.class_id,
        this.msgListener,
        this.onLineStatusChanged
      );
      let teacher = new Object();
      teacher.name = this.name ? this.name : "A teacher";
      teacher.state = "online";
      teacher.user_id = this.uid;
      this.teacherList.push(teacher);
    },
    msgListener(d) {
      console.log(d, "====收到消息命令");
      if (d.type === SocketEventsEnum.STUDENTS_COUNTS) {
        // 人数更新
        console.log(d.student_count, "d.student_count");
        //  this.studentCounts = d.student_count;
        if (d.join_in) {
          let student = new Object();
          student.name = d.join_in.user_name;
          student.user_id = d.join_in.user_id;
          student.state = "online";
          student.count = 1;
          let findFlag = false;
          if (d.join_in.role == "student") {
            for (let i = 0; i < this.studentList.length; i++) {
              if (this.studentList[i].user_id == student.user_id) {
                this.studentList[i].count++;
                this.studentList[i].state = "online";
                findFlag = true;
              }
            }
            if (!findFlag) {
              this.studentList.push(student);
            }
            this.studentCounts = this.studentList.length;
          } else if (d.join_in.role == "teacher") {
            for (let i = 0; i < this.teacherList.length; i++) {
              if (this.teacherList[i].user_id == student.user_id) {
                this.teacherList[i].count++;
                this.teacherList.state = "online";
                findFlag = true;
              }
            }
            if (!findFlag) {
              this.teacherList.push(student);
            }
          }
        } else if (d.quit) {
          if (d.quit.role == "student") {
            for (let i = 0; i < this.studentList.length; i++) {
              if (this.studentList[i].user_id == d.quit.user_id) {
                this.studentList[i].count--;
                if (this.studentList[i].count < 1) {
                  this.studentList[i].state = "offline";
                }
              }
            }
            this.studentCounts = this.studentList.length;
            console.log(this.studentList, "test quit");
          } else if (d.quit.role == "teacher") {
            for (let i = 0; i < this.teacherList.length; i++) {
              if (this.teacherList[i].user_id == d.quit.user_id) {
                this.teacherList[i].count--;
                if (this.teacherList[i].count < 1) {
                  this.teacherList[i].state = "offline";
                }
              }
            }
            console.log(this.teacherList, "test quit");
          }
        }
      } else if (d.type === SocketEventsEnum.RENAME) {
        // 改名
        const { user_id, user_name_new } = d;
        for (let i = 0; i < this.studentList.length; i++) {
          if (this.studentList[i].user_id == user_id) {
            this.studentList[i].name = user_name_new;
            break;
          }
        }
        // this.user_name = user_name_new;
        // for (let i = 0; i < this.textList.length; i++) {
        //   if (user_id === this.textList[i].user_id) {
        //     let newVaule = this.textList[i];
        //     newVaule.user_name = user_name_new;
        //     //   Vue.set(this.textList, i, newValue);
        //   }
        // }
      } else if (d.type === SocketEventsEnum.GO_PAGE) {
        if (d.room == this.class_id) {
          if (d.params) {
            // this.pageChange(d.params.page);
            this.current_page = parseInt(d.params.page) + 1;
            this.pageChange(this.current_page, true);
          }
        }
      } else if (d.type == SocketEventsEnum.MODEL_CHANGE) {
        if (d.room == this.class_id) {
          this.page_model =
            d.params.mode == "student-paced"
              ? ClassRoomModelEnum.STUDENT_MODEL
              : ClassRoomModelEnum.TEACHER_MODEL;
        }
      } else if (d.type == SocketEventsEnum.SHOW_RESPONSE) {
        if (d.room == this.class_id) {
          this.showResponse = d.params.response;
          console.log(this.showResponse, "show res change!!!");
        }
      } else if (d.type == SocketEventsEnum.CHANGE_SESSION_STATUS) {
        if (!this.classRoomInfo) return;
        this.classRoomInfo.status = d.params.status;
        this.$forceUpdate();
      } else if (d.type == SocketEventsEnum.LOCK_PAGE) {
        if (!this.classRoomInfo) return;
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
        console.log("refresh lockpage", this.classRoomInfo.lock_page);
      } else if (d.type == SocketEventsEnum.STAR_OR_HIDE_ANSWER) {
        if (d.params) {
          const {
            pageId,
            itemId,
            title,
            studentId,
            nextStatus,
            type
          } = d.params;
          this.handleStarOrHide(
            pageId,
            itemId,
            title,
            studentId,
            nextStatus,
            type,
            false
          );
          // if (this.currentPageId != pageId) {
          //   return;
          // }
          // let i = 0;
          // for (; i < this.responseContentList.length; i++) {
          //   if (
          //     this.responseContentList[i].item_id == itemId &&
          //     this.responseContentList[i].user_id == studentId
          //   ) {
          //     if (type == "star") {
          //       this.responseContentList[i].star = nextStatus;
          //     } else if (type == "show") {
          //       this.responseContentList[i].show = nextStatus;
          //     }
          //   }
          // }
        }
      }

      // 回答问题
      const { room, page_id } = d;
      // 过滤非当前页面数据
      if (room != this.class_id || page_id !== this.currentPageId) return;
      // 回答choice
      if (d.type === SocketEventsEnum.ANSWER_QUESTION) {
        const { answer, user_id, type } = d;
        addTeacherData(this.currentPageId, type, {
          user_id,
          answer,
          star: false,
          show: true,
          key: user_id
        });
        EventBus.$emit("choice", { user_id, answer });
      } else if (
        d.type == SocketEventsEnum.TEXT_INPUT ||
        d.type === SocketEventsEnum.NUMBER_INPUT
      ) {
        //接收到text input或者number input的值
        const { content, user_id, user_name, item_id, type } = d;
        addTeacherData(this.currentPageId, type, {
          user_id,
          content,
          user_name,
          item_id,
          star: false,
          show: true,
          key: `${item_id}_${user_id}`
        });
      } else if (d.type === SocketEventsEnum.DRAW_CANVAS) {
        console.log(d);
        const { content, type, user_id, user_name } = d;
        addTeacherData(this.currentPageId, type, {
          user_id,
          content,
          star: false,
          show: true,
          key: user_id,
          user_name
        });
        EventBus.$emit("draw", { user_id, content, user_name });
      }

      this.getResponeCount();
    },

    pageChange(value, notSend) {
      console.log(value, "pageChage!!!");
      this.currentIndex = value - 1;
      this.getItemData();
      if (!notSend && this.page_model != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.class_id}", "token": "${this.token}","class_id":"${this.class_id}","type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
        );
      }
    },

    queryResult(code, token, count) {
      let _this = this;
      if (count < 20) {
        queryRefreshResult(code, token)
          .then(res => {
            if (res.data.status === "processing") {
              setTimeout(function() {
                _this.queryResult(code, token, ++count);
              }, 1000);
            } else {
              this.getAllSlides();
              hideLoading();
            }
          })
          .catch(res => {
            this.getAllSlides();
            hideLoading();
          });
      } else {
        this.getAllSlides();
        hideLoading();
      }
    },
    getAllSlides() {
      // 初始化评论数据
      initTeacherCommentData(this.class_id, this.token);
      Promise.all([
        initTeacherData(this.class_id, this.token),
        getAllPPTS(this.slide_id)
      ]).then(([alldata, list]) => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        this.getItemData();
        for (let i = 0; i < list.length; i++) {
          this.responsePercentage[i] = 0;
        }
        this.isFocus[this.currentIndex] = true;
      });
    },
    getItemData() {
      // this.options = [];
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentIndex];
        this.currentItemData.flag = false;
        this.getResponeCount();
      });
    },
    getResponeCount() {
      if (this.currentItemData.items[0]) {
        // const list = getCurrentPageAnswerList(
        //   this.currentItemData.page_id,
        //   this.currentItemData.items[0].type
        // );
        const list = getTeacherCurrentPageAnswerList(
          this.currentItemData.page_id,
          this.currentItemData.items[0].type
        );
        console.log(list, "=====");
        this.currentAnswerCount = list.length;

        this.responseContentList = list;

        let count = 0;
        let id = "-1";
        for (let i = 0; i < list.length; i++) {
          if (id != list[i].user_id) {
            count++;
            id = list[i].user_id;
          }
        }

        if (this.studentCounts < count) {
          this.studentCounts = count;
        }
        if (count == 0) {
          this.responsePercentage[this.currentIndex] = 0;
        } else {
          this.responsePercentage[this.currentIndex] =
            (count * 100) / this.studentCounts;
        }
      } else {
        this.currentAnswerCount = 0;
      }
    },

    copyUrl() {
      if (!this.page_model) {
        this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
      }
      const url = `${location.origin}${location.pathname}#/students?slide_id=${this.slide_id}&page=${this.currentIndex}&class_id=${this.class_id}`;
      copy(url);
      showToast("copy link success");
    },

    emitSo(message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit("control", message);
      }
    },

    turnModel() {
      if (this.page_model === ClassRoomModelEnum.STUDENT_MODEL) {
        this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
      } else {
        this.page_model = ClassRoomModelEnum.STUDENT_MODEL;
      }

      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        console.log(this.page_model, "send message");
        this.emitSo(
          `{"room":"${this.class_id}", "type": "${
            SocketEventsEnum.MODEL_CHANGE
          }", "token": "${this.token}","class_id":"${
            this.class_id
          }","params": {"mode": "${
            this.page_model === ClassRoomModelEnum.TEACHER_MODEL
              ? "insturctor-paced"
              : "student-paced"
          }"}}`
        );
      }
    },

    showres() {
      this.showResponse = !this.showResponse;
      this.emitSo(
        `{"room":"${this.class_id}", "type": "${SocketEventsEnum.SHOW_RESPONSE}", "token": "${this.token}","class_id":"${this.class_id}","params": {"response": ${this.showResponse}}}`
      );
    },
    leavePage() {
      let url = "";
      if (this.isDashboard) {
        url = "https://docs.google.com/presentation/d/" + this.slide_id;
      } else {
        url = "https://dev.classcipe.com/";
      }
      console.log(this.slide_id);
      if (this.slide_id) {
        window.location = url;
      }
    },
    endLesson(confirm) {
      if (this.classRoomInfo.status == "close") {
        let url = "https://docs.google.com/presentation/d/" + this.slide_id;
        window.location.href = url;
        return;
      }
      if (!confirm && this.page_model == ClassRoomModelEnum.STUDENT_MODEL) {
        this.dialogVisible = true;
      } else {
        //离开
        this.dialogVisible = false;
        this.confirmCloseDialogVisible = true;
      }
    },

    cancelEndClass() {
      this.confirmCloseDialogVisible = false;
    },
    endClassroom(name) {
      console.log(name);
      if (!name) {
        name = this.classRoomInfo.class_name;
      }
      showLoading();

      endClassRoomReq(this.token, name, this.class_id)
        .then(res => {
          console.log(res);
          let _this = this;
          this.confirmCloseDialogVisible = false;
          if (res.code == "ok") {
            this.emitSo(
              `{"room":"${this.class_id}", "type": "${SocketEventsEnum.CHANGE_SESSION_STATUS}", "token": "${this.token}","class_id":"${this.class_id}","params": {"status": "close"}}`
            );
            setTimeout(function() {
              hideLoading();
              let url =
                "https://docs.google.com/presentation/d/" + _this.slide_id;
              window.location.href = url;
            }, 2000);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message("error", "Close Session error");
          hideLoading();
        });
      //结束课程
    },
    lockPage() {
      let islocked = true;
      let page_id = this.slides[this.currentIndex].page_id;
      if (!this.classRoomInfo.lock_page) {
        islocked = true;
        this.classRoomInfo.lock_page = new Array();
        this.classRoomInfo.lock_page.push(page_id);
      } else {
        let pages = this.classRoomInfo.lock_page.filter(
          item => item != page_id
        );
        islocked = this.classRoomInfo.lock_page.length == pages.length;
        if (islocked) {
          this.classRoomInfo.lock_page.push(page_id);
        } else {
          this.classRoomInfo.lock_page = pages;
        }
      }
      console.log(this.classRoomInfo.lock_page, "锁定页面");
      this.$forceUpdate();
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.emitSo(
          `{"room":"${this.class_id}", "type": "${
            SocketEventsEnum.LOCK_PAGE
          }", "token": "${this.token}","class_id":"${
            this.class_id
          }","params": {"lock": ${islocked},"page":"${
            this.slides[this.currentIndex].page_id
          }"}}`
        );
      }
    },
    openProject() {
      const url = `${location.origin}${location.pathname}#/class?slide_id=${this.slide_id}&page=${this.currentIndex}&class_id=${this.class_id}&type=classroom`;
      window.open(url);
    },
    open(model) {
      // this.$router.push({ path: "/dashboard" });

      if (model == 0) {
        console.log(0 + "_blank");
        var windowObjectReference;
        var strWindowFeatures =
          "width=900,height=750,menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200";

        //"/index.html#/dashboard?slide_id=" + this.slide_id
        windowObjectReference = window.open(
          "about:blank",
          "_blank",
          strWindowFeatures
        );
        if (!this.page_model) {
          this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
        }
        windowObjectReference.location =
          "/index.html#/class?slide_id=" +
          this.slide_id +
          "&currentPage=" +
          this.currentIndex +
          "&class_id=" +
          this.class_id +
          "&type=dashboard";
      } else if (model == 1) {
        console.log(1);
        window.open(
          "/index.html#/class?slide_id=" +
            this.slide_id +
            "&currentPage=" +
            this.currentIndex +
            "&class_id=" +
            this.class_id +
            "&type=dashboard"
        );
      }
    },

    //显示当前的学生
    showStudents() {
      this.dialogTableVisible = true;
    },

    //重新开启课堂
    _reopenClass() {
      reopenClass(this.token, this.class_id)
        .then(res => {
          console.log(res);
          if (res.code == "ok") {
            this.classRoomInfo.status = "live";
            this.emitSo(
              `{"room":"${this.class_id}", "type": "${SocketEventsEnum.CHANGE_SESSION_STATUS}", "token": "${this.token}","class_id":"${this.class_id}","params": {"status": "live"}}`
            );
          } else {
            if (res.data) {
              this.$message({ message: res.data.message, type: "error" });
            } else if (res.message) {
              this.$message({ message: res.message, type: "error" });
            }
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    getStudentOnLineCount() {
      let i = 0;
      let count = 0;
      for (i = 0; i < this.studentList.length; i++) {
        if ("online" == this.studentList[i].state) {
          count++;
        }
      }

      return count;
    },
    getTeacherOnLineCount() {
      let i = 0;
      let count = 0;
      for (i = 0; i < this.teacherList.length; i++) {
        if ("online" == this.teacherList[i].state) {
          count++;
        }
      }

      return count;
    },
    openTwo() {
      this.stepOneDialog = false;
      this.stepTwoDialog = true;
    },
    closeTwo() {
      this.stepOneDialog = false;
      this.stepTwoDialog = false;
    },
    giveFocus(index, notSend) {
      this.currentIndex = index;
      this.getItemData();
      if (!notSend && this.currentModel != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.class_id}", "type": "${SocketEventsEnum.GO_PAGE}","token": "${this.token}","class_id":"${this.class_id}", "params": {"page": "${this.currentIndex}"}}`
        );
      }

      for (let i = 0; i < this.slides.length; i++) {
        this.isFocus[i] = i == index;
      }
      this.$forceUpdate();
    }
  }
};
</script>,
    