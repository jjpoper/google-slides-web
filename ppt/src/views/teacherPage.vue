<template>
  <div class="page">
    <student-paced-note
      v-if="showStudentPacedNotePage"
      class="student_note_page"
      :confirmModeChange="confirmModeChange"
      :cancelModeChange="cancelModeChange"
    />
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
        :getPageStudent="getPageStudent"
        :getStudentName="getStudentName"
        v-else-if="currentItemData && slides"
      />
    </div>

    <!-- :changePage="giveFocus" -->
    <div class="control">
      <teacher-control-panel
        v-if="classRoomInfo && currentItemData"
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
        :currentItemData="currentItemData"
        :setTimeDialogShow="setTimeDialogShow"
        :showStudentQuestions="showStudentQuestions"
        :questionModalVisiable="questionModalVisiable"
      />
    </div>

    <comment-modal />
    <div class="top_btn">
      <div class="online_status">
        <i class="el-icon-s-opportunity" :style="`color: ${onLine ? 'green' : 'red'}`" />
      </div>
      <div class="share_room" @click="copyUrl()">Share Class</div>

      <div
        class="number_info"
        @click="showStudents()"
      >Class Roster {{ getStudentOnLineCount() }}/{{ studentList.length }}</div>
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
      <stepOneView :openTwo="openTwo" :hideStepOne="hideStepOne" />
    </el-dialog>

    <el-dialog
      :title="getStepTwoTitle()"
      :visible.sync="stepTwoDialog"
      @close="closeCopyLinkDialog()"
      @open="openCopyLinkDialog()"
    >
      <stepTwoView :copyUrl="copyLink" :closeTwo="closeTwo" />
    </el-dialog>

    <el-dialog title="Set feedback failure" :visible.sync="showTimeSetDialog">
      <feedbackTimePanel
        :mode="mode"
        :changeFeedbackTimeMode="changeFeedbackTimeMode"
        :confirm="hindeTimeDialog"
      />
    </el-dialog>

    <!-- custom-class="custom-dialog" -->

    <el-dialog
      title="Share this link with your students"
      :visible.sync="showCopyLinkDialog"
      @close="closeCopyLinkDialog()"
      @open="openCopyLinkDialog()"
    >
      <copyLinkDialog
        v-if="classRoomInfo"
        :getStudentOnLineCount="getStudentOnLineCount"
        :url="getStudentUrl()"
        :copyLink="copyLink"
        :getBtnString="getBtnString"
        :enterClassroom="enterClassroom"
        :setTimeDialogShow="setTimeDialogShow"
        :currentMode="page_model"
        :isDashboard="isDashboard"
      />
    </el-dialog>
    <students-qs-modal v-if="questionModalVisiable" :list="filterMarkupList" />
  </div>
</template>

<style lang="scss">
.custom-dialog.el-dialog {
  padding: 0;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>

<style scoped>
.page {
  width: 100%;
  height: 100%;
}
.student_note_page {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0%;
  top: 0%;
  z-index: 9999;
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
  getOnlineUsers,
  getAVComment
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
  saveAnswerList,
  getStundentUidAndName,
  saveStepOneStatus,
  getStepOneStatus
} from "@/model/store.teacher";
import teacherControlPanel from "../components/teacher/teacherControlPanel";
import ConfirmEndDialog from "@/components/teacher/confirmEndDialog.vue";
import CommentModal from "@/components/teacher/commentModal.vue";
import TeacherPPTPage from "@/components/teacher/teacherPPTPage.vue";
import DashboardPage from "@/components/teacher/dashboardPage.vue";
import stepOneView from "../components/teacher/openDashboardStepOne";
import stepTwoView from "../components/teacher/openDashboardStepTwo";
import studentList from "../components/teacher/studentList";
import feedbackTimePanel from "../components/teacher/feedbackTimePanel";
import copyLinkDialog from "../components/teacher/copyUrlDialog";
import StudentPacedNote from "@/components/teacher/studentPacedNote.vue";
import StudentsQsModal from "@/components/teacher/studentsQsModal.vue";
export default {
  components: {
    teacherControlPanel,
    ConfirmEndDialog,
    CommentModal,
    TeacherPPTPage,
    DashboardPage,
    stepOneView,
    stepTwoView,
    studentList,
    feedbackTimePanel,
    copyLinkDialog,
    StudentPacedNote,
    StudentsQsModal
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
      responsePercentage: [],
      isFocus: [],
      stepOneDialog: false,
      stepTwoDialog: false,
      onLine: false, // 在线状态
      directFromPlugin: false, //是否是从插件直接打开的。
      showTimeSetDialog: false,
      showCopyLinkDialog: false,
      copyLinkBtnString: "",
      firstCloseCopyLinkDialog: true,
      mode: 1,
      showStudentPacedNotePage: false,
      questionModalVisiable: false,
      markupslist: [] // ppt comment列表
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
    },
    filterMarkupList() {
      if (this.currentPageId) {
        console.log(this.currentPageId);
        const list = this.markupslist.filter(
          item => item.data.page_id === this.currentPageId
        );
        return list;
      }
      return [];
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { slide_id, token, class_id, type } = to.query;
      vm.slide_id = slide_id;
      vm.class_id = class_id;
      window.classId = class_id;
      vm.currentIndex = to.query.page ? to.query.page : 0;
      vm.isDashboard = type == "dashboard";
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
      this.onLine = status;
    },
    getStepTwoTitle() {
      return "This Session is in " + this.page_model + " Mode";
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
      let i = 0;
      let itemData = null;
      for (let j = 0; j < this.slides.length; j++) {
        if (this.slides[j].page_id == pageId) {
          itemData = this.slides[j].items;
        }
      }
      if (!itemData) {
        return;
      }
      let responseList = getTeacherCurrentPageAnswerList(
        pageId,
        itemData[0].type
      );
      for (; i < responseList.length; i++) {
        if (
          (responseList[i].item_id == itemId ||
            responseList[i].answer == itemId ||
            responseList[i].key == studentId) &&
          responseList[i].user_id == studentId
        ) {
          if (type == "star") {
            responseList[i].star = nextStatus;
          } else if (type == "show") {
            responseList[i].show = nextStatus;
          }
          if (itemData[0]) {
            if (itemData[0].type == "choice") {
              const user_id = studentId;
              const answer = itemId;
              addTeacherData(pageId, itemData[0].type, {
                user_id,
                answer,
                star: responseList[i].star,
                show: responseList[i].show,
                key: user_id
              });
              const data = this.currentItemData;
              EventBus.$emit("choice", { data });
            } else if (itemData[0].type == "draw") {
              const user_id = studentId;
              const content = responseList[i].content;
              const user_name = responseList[i].user_name;
              addTeacherData(pageId, itemData[0].type, {
                user_id,
                content,
                user_name,
                star: responseList[i].star,
                show: responseList[i].show,
                key: user_id
              });
              EventBus.$emit("draw", { user_id, content, user_name });
            } else if (
              itemData[0].type == "text" ||
              itemData[0].type == "number"
            ) {
              const user_id = studentId;
              const content = responseList[i].content;
              const user_name = responseList[i].user_name;
              const item_id = responseList[i].item_id;
              addTeacherData(pageId, itemData[0].type, {
                user_id,
                content,
                user_name,
                item_id,
                star: responseList[i].star,
                show: responseList[i].show,
                key: `${item_id}_${user_id}`
              });
              EventBus.$emit(itemData[0].type, { user_id, pageId });
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
      teacherName,
      commentType
    }) {
      const itemData = JSON.stringify({
        type: SocketEventsEnum.TEACHER_COMMENT,
        studentId,
        pageId,
        itemId,
        title,
        time,
        value,
        commentType,
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

      if (this.directFromPlugin) {
        if (getStepOneStatus(this.class_id, this.slide_id)) {
          this.stepTwoDialog = true;
        } else {
          this.stepOneDialog = true;
        }
      }
      queryClassStatus(this.class_id, this.token)
        .then(res => {
          this.classRoomInfo = res;
          this.classRoomInfo.showResponsePages = new Array();
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
        .then(res => {
          if (res.code == "ok") {
            let list = res.data;
            for (let i = 0; i < list.length; i++) {
              let { user_id, role, user_name } = list[i];
              console.log(user_id, role, user_name);
              let user = new Object();
              user.name = user_name;
              user.user_id = user_id;
              user.state = "online";
              user.count = 1;
              if (role == "student") {
                user.page = list[i].page;
                this.studentList.push(user);
              } else if (role == "teacher") {
                this.teacherList.push(user);
              }
            }
          }
          this.studentCounts = this.studentList.length;
          if (this.studentCounts == 0) {
            if (this.isDashboard) {
              if (!this.directFromPlugin) {
                this.stepTwoDialog = true;
              }
            } else {
              this.showCopyLinkDialog = true;
            }
          }
        })
        .catch(res => {});

      getAVComment(this.class_id, this.token)
        .then(res => {
          console.log(res);
          if (res.code == "ok") {
            this.markupslist = res.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
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
      console.log(d);
      if (d.type === SocketEventsEnum.STUDENTS_COUNTS) {
        // 人数更新
        //  this.studentCounts = d.student_count;
        if (d.join_in) {
          let student = new Object();
          student.name = d.join_in.user_name;
          student.user_id = d.join_in.user_id;
          student.state = "online";
          student.count = 1;
          student.page_id = d.page_id;
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

            //发送一个页面同步消息
            if (this.page_model === ClassRoomModelEnum.TEACHER_MODEL) {
              this.emitSo(
                `{"room":"${this.class_id}", "token": "${this.token}","class_id":"${this.class_id}","type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
              );
            }
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
          } else if (d.quit.role == "teacher") {
            for (let i = 0; i < this.teacherList.length; i++) {
              if (this.teacherList[i].user_id == d.quit.user_id) {
                this.teacherList[i].count--;
                if (this.teacherList[i].count < 1) {
                  this.teacherList[i].state = "offline";
                }
              }
            }
          }
        }
      } else if (d.type === SocketEventsEnum.RENAME) {
        // 改名
        const { user_id, user_name_new, page_id } = d;
        for (let i = 0; i < this.studentList.length; i++) {
          if (this.studentList[i].user_id == user_id) {
            this.studentList[i].name = user_name_new;
            break;
          }
        }
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
        }
      } else if (d.type == SocketEventsEnum.STUDETN_GO_PAGE) {
        const { room, user_id } = d;
        if (room != this.class_id) {
          return;
        }
        for (let i = 0; i < this.studentList.length; i++) {
          if (this.studentList[i].user_id == user_id) {
            this.studentList[i].page = d.params.page;
            //    this.$forceUpdate();
            break;
          }
        }
      } else if (d.type == SocketEventsEnum.SET_DEADLINE_TIME) {
        console.log(d.params, SocketEventsEnum.SET_DEADLINE_TIME);
      } else if (d.type == SocketEventsEnum.COPY_LINK_DIALOG_CLOSE) {
        this.firstCloseCopyLinkDialog = false;
        this.showCopyLinkDialog = false;
        this.stepTwoDialog = false;
      } else if (d.type == SocketEventsEnum.COPY_LINK_DIALOG_OPEN) {
        if (this.isDashboard) {
          this.stepTwoDialog = true;
        } else {
          this.showCopyLinkDialog = true;
        }
      } else if (d.type === SocketEventsEnum.STUNDENT_COMMENT_PPT) {
        // 评论ppt消息
        this.markupslist.push(d);
        return;
      }

      // 回答问题
      const { room, page_id } = d;
      // 过滤非当前页面数据 是否需要过滤当前页面？？ page_id !== this.currentPageId
      if (room != this.class_id) return;
      // 回答choice
      if (d.type === SocketEventsEnum.ANSWER_QUESTION) {
        const { answer, user_id, type } = d;
        addTeacherData(page_id, type, {
          user_id,
          answer,
          star: false,
          show: true,
          key: user_id
        });
        const data = this.currentItemData;
        EventBus.$emit("choice", { data });
      } else if (
        d.type == SocketEventsEnum.TEXT_INPUT ||
        d.type === SocketEventsEnum.NUMBER_INPUT
      ) {
        //接收到text input或者number input的值
        const { content, user_id, user_name, item_id, type } = d;
        addTeacherData(page_id, type, {
          user_id,
          content,
          user_name,
          item_id,
          star: false,
          show: true,
          key: `${item_id}_${user_id}`
        });
        EventBus.$emit(d.type, { user_id, page_id });
      } else if (d.type === SocketEventsEnum.DRAW_CANVAS) {
        const { content, type, user_id, user_name } = d;
        addTeacherData(page_id, type, {
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
      console.log(value, "pageChage!!!" + this.isDashboard);
      if (this.isDashboard) {
        this.giveFocus(value - 1, notSend);
        return;
      }
      this.currentIndex = value - 1;
      this.questionModalVisiable = false;//与控制面板中的comment显示与否的按钮保持同步
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
      this.currentItemData = null;
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentIndex];
        this.currentItemData.flag = this.isDashboard;
        this.getResponeCount();
      });
    },
    getResponeCount() {
      if (
        this.currentItemData &&
        this.currentItemData.items &&
        this.currentItemData.items[0]
      ) {
        // const list = getCurrentPageAnswerList(
        //   this.currentItemData.page_id,
        //   this.currentItemData.items[0].type
        // );
        const list = getTeacherCurrentPageAnswerList(
          this.currentItemData.page_id,
          this.currentItemData.items[0].type
        );
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
      if (this.isDashboard) {
        this.stepTwoDialog = true;
      } else {
        this.showCopyLinkDialog = true;
      }
    },

    getBtnString() {
      if (this.getStudentOnLineCount() == 0) {
        this.copyLinkBtnString = "Waiting for students..";
      } else if (this.currentIndex == 0) {
        this.copyLinkBtnString = "Start Class";
      } else {
        this.copyLinkBtnString = "Continue";
      }
      return this.copyLinkBtnString;
    },

    getStudentUrl() {
      if (!this.page_model) {
        this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
      }
      const url = `${location.origin}${location.pathname}#/students?slide_id=${this.slide_id}&page=${this.currentIndex}&class_id=${this.class_id}`;
      return url;
    },

    copyLink() {
      copy(this.getStudentUrl());
      showToast("copy link success");
      // this.showCopyLinkDialog = false;
      // this.stepTwoDialog = false;
    },

    emitSo(message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit("control", message);
      }
    },

    turnModel() {
      console.log(this.page_model);
      if (this.page_model === ClassRoomModelEnum.STUDENT_MODEL) {
        this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
        this.sendModeChangeCommend();
      } else {
        this.showStudentPacedNotePage = true;
      }
    },

    confirmModeChange() {
      this.page_model = ClassRoomModelEnum.STUDENT_MODEL;
      this.sendModeChangeCommend();
      this.showStudentPacedNotePage = false;
    },
    cancelModeChange() {
      this.showStudentPacedNotePage = false;
    },

    sendModeChangeCommend() {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
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

        if (this.page_model === ClassRoomModelEnum.TEACHER_MODEL) {
          //如果从学生模式切换到老师模式，则通知学生进行页面切换操作
          this.emitSo(
            `{"room":"${this.class_id}", "token": "${this.token}","class_id":"${this.class_id}","type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
          );
        }
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
    enterClassroom() {
      this.showCopyLinkDialog = false;
    },
    openProject() {
      const url = `${location.origin}${location.pathname}#/class?slide_id=${this.slide_id}&page=${this.currentIndex}&class_id=${this.class_id}&type=classroom`;
      window.open(url);
    },
    open(model) {
      if (model == 0) {
        console.log(0 + "_blank");
        var windowObjectReference;
        var strWindowFeatures =
          "width=1200,height=750,menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200";
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
          "&page=" +
          this.currentIndex +
          "&class_id=" +
          this.class_id +
          "&type=dashboard";
      } else if (model == 1) {
        console.log(1);
        window.open(
          "/index.html#/class?slide_id=" +
            this.slide_id +
            "&page=" +
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
      this.currentItemData = this.slides[index];
      this.currentItemData.flag = this.isDashboard;
      this.getResponeCount();
      if (!notSend && this.page_model != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.class_id}", "type": "${SocketEventsEnum.GO_PAGE}","token": "${this.token}","class_id":"${this.class_id}", "params": {"page": "${this.currentIndex}"}}`
        );
      }
      for (let i = 0; i < this.slides.length; i++) {
        this.isFocus[i] = i == index;
      }
      const data = this.currentItemData;
      if (
        this.currentItemData.items[0] &&
        this.currentItemData.items[0].type == "choice"
      ) {
        EventBus.$emit("choice", { data });
      }
    },
    getPageStudent(index) {
      let count = 0;
      console.log(this.studentList);
      if (this.page_model === ClassRoomModelEnum.TEACHER_MODEL) return 0;
      for (let i = 0; i < this.studentList.length; i++) {
        if (
          this.studentList[i].state == "online" &&
          this.studentList[i].page == this.slides[index].page_id
        ) {
          count++;
        }
      }
      return count;
    },
    getStudentName(index) {
      let result = "";
      if (this.page_model === ClassRoomModelEnum.TEACHER_MODEL) return "";
      for (let i = 0; i < this.studentList.length; i++) {
        if (
          this.studentList[i].state == "online" &&
          this.studentList[i].page == this.slides[index].page_id
        ) {
          result += this.studentList[i].name + ",";
        }
      }
      return result.substring(0, result.length - 1);
    },
    hindeTimeDialog(mode, deadline, countDownTime) {
      this.showTimeSetDialog = false;
      let value = 0;

      if (mode == 1) {
        console.log(mode, deadline.getTime());
        value = deadline.getTime();
        let now = Date.now();
        if (now > value) {
          this.$message("error", "Please select right time");
          return;
        }
        value = value / 1000;
      } else if (mode == 2) {
        value = countDownTime * 60;
      }

      this.emitSo(
        `{"room":"${this.class_id}", "type": "${SocketEventsEnum.SET_DEADLINE_TIME}","token": "${this.token}","class_id":"${this.class_id}", "params": {"response_limit_mode":${mode},"response_limit_time":${value}}}`
      );
    },
    setTimeDialogShow() {
      this.showTimeSetDialog = true;
      this.showCopyLinkDialog = false;
    },
    changeFeedbackTimeMode(index) {
      this.mode = index;
    },

    closeCopyLinkDialog() {
      if (this.firstCloseCopyLinkDialog) {
        this.firstCloseCopyLinkDialog = false;
        this.emitSo(
          `{"room":"${this.class_id}", "type": "${SocketEventsEnum.COPY_LINK_DIALOG_CLOSE}","token": "${this.token}","class_id":"${this.class_id}"}`
        );
      }
    },
    openCopyLinkDialog() {
      console.log("open copy link dialog!!");
      this.emitSo(
        `{"room":"${this.class_id}", "type": "${SocketEventsEnum.COPY_LINK_DIALOG_OPEN}","token": "${this.token}","class_id":"${this.class_id}"}`
      );
    },
    showStudentQuestions(visiable) {
      this.questionModalVisiable = visiable;
    },
    hideStepOne() {
      saveStepOneStatus(this.class_id, this.slide_id, "true");
      this.stepTwoDialog = true;
      this.stepOneDialog = false;
    }
  }
};
</script>,
    