<template>
  <div class="page">
    <student-paced-note
      v-if="showStudentPacedNotePage"
      class="student_note_page"
      :confirmModeChange="confirmModeChange"
      :cancelModeChange="cancelModeChange"
    />
    <template v-if="!questionModalVisiable">
      <div class="content" v-if="currentItemData">
        <TeacherPPTPage
          v-if="!isDashboard && currentItemData"
          :currentItemData="currentItemData"
          :showResponse="showResponse"
          :currentAnswerCount="currentAnswerCount"
          :responseContentList="responseContentList"
          :filterAddedMediaList="filterAddedMediaList"
          :meterialVisiable="meterialVisiable"
        />

        <DashboardPage
          v-else-if="currentItemData && slides"
          :currentItemData="currentItemData"
          :showResponse="showResponse"
          :showres="showres"
          :currentAnswerCount="currentAnswerCount"
          :responseContentList="responseContentList"
          :responsePercentage="responsePercentage"
          :slides="slides"
          :getPageStudent="getPageStudent"
          :getStudentName="getStudentName"
          :page_model="page_model"
          :filterAddedMediaList="filterAddedMediaList"
          :meterialVisiable="meterialVisiable"
          :filterTips="filterTips"
          :overviewModalVisiable="overviewModalVisiable"
        />
      </div>

      <div class="control">
        <teacher-control-panel
          v-if="classRoomInfo && currentItemData"
          :current_model="page_model"
          :currentPage="parseInt(currentPageIndex) + 1"
          :totalPage="slides.length"
          :isDashboard="isDashboard"
          :changePage="pageChange"
          :turnModel="turnModel"
          :open="open"
          :addprompt="addprompt"
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
          :changeShowMetrial="changeShowMetrial"
          :meterialVisiable="meterialVisiable"
          :showDashTips="showDashTips"
          :dashTipsModalVisiable="dashTipsModalVisiable"
        />
      </div>
    </template>

    <!-- <students-qs-modal
      v-if="currentItemData && questionModalVisiable"
      :list="filterMarkupList"
      :url="currentItemData.thumbnail_url"
    />-->

    <comment-modal />
    <div class="top_btn" v-if="!isDashboard">
      <div class="online_status">
        <i
          class="el-icon-s-opportunity"
          :style="`color: ${onLine ? 'green' : 'red'}`"
        />
      </div>
      <div style="display: flex">
        <div class="share_room" @click="copyUrl()">Share Class</div>
        <div style="margin-right: 20px; cursor: pointer" @click="shareScreen">
          <svg
            t="1634352581902"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2514"
            width="48"
            height="48"
          >
            <path
              d="M864 159.872L160 160c-17.696 0-32 14.176-32 31.872v448a32 32 0 0 0 32 32h704a32 32 0 0 0 32-32v-448a32 32 0 0 0-32-32zM864 640H160V191.872h704V640z"
              fill="#333333"
              p-id="2515"
            ></path>
            <path
              d="M928 32H96a96 96 0 0 0-96 96v640a95.904 95.904 0 0 0 95.68 95.936H416v38.944l-199.744 25.952A31.968 31.968 0 0 0 224 991.872h576a32 32 0 0 0 7.744-63.072L608 902.88v-38.944h320.32A95.904 95.904 0 0 0 1024 768V128a96 96 0 0 0-96-96z m32 736c0 17.632-14.368 32-32 32H96c-17.664 0-32-14.368-32-32V128a32 32 0 0 1 32-32h832c17.632 0 32 14.336 32 32v640z"
              fill="#333333"
              p-id="2516"
            ></path>
          </svg>
        </div>
        <div class="number_info" @click="showStudents()">
          Class Roster {{ getStudentOnLineCount() }}/{{ studentList.length }}
        </div>
        <el-tooltip content="mark up and send comment" placement="top">
          <div class="readchat comment" v-if="isDashboard">
            <el-switch
              style="display: block"
              v-model="questionModalVisiable"
              active-color="#13ce66"
              inactive-color="#999"
              active-text="comment"
            ></el-switch>
            <el-switch
              style="display: block; margin-left: 10px"
              v-model="overviewModalVisiable"
              active-color="#13ce66"
              inactive-color="#999"
              active-text="overview slides"
            ></el-switch>
          </div>
        </el-tooltip>
      </div>
    </div>

    <!--dashboard header-->
    <DashHeader
      v-if="isDashboard && classRoomInfo"
      :share="copyUrl"
      :onLine="onLine"
      :className="classRoomInfo.class_name"
      :openProject="openProject"
      :endLesson="endLesson"
    />

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

    <el-dialog
      width="85%"
      :visible.sync="dialogTableVisible"
      custom-class="no-padding"
      :show-close="false"
    >
      <studentList
        :closeStudents="closeStudents"
        :classRoomInfo="classRoomInfo"
        :teacherList="teacherList"
        :studentList="studentList"
      />
    </el-dialog>

    <el-dialog
      title="Wellcom to the Teacher Dashboard!"
      :visible.sync="stepOneDialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <stepOneView :openTwo="openTwo" :hideStepOne="hideStepOne" />
    </el-dialog>

    <!-- @close="closeCopyLinkDialog()" -->
    <el-dialog
      :title="getStepTwoTitle()"
      :visible.sync="stepTwoDialog"
      @open="openCopyLinkDialog()"
      custom-class="custom-dialog"
      width="80%"
    >
      <!-- <stepTwoView :copyUrl="copyLink" :closeTwo="closeTwo" /> -->
      <dash-copy-dialog
        v-if="classRoomInfo"
        :getStudentOnLineCount="getStudentOnLineCount"
        :url="getStudentUrl()"
        :copyLink="copyLink"
        :getBtnString="getBtnString"
        :enterClassroom="enterClassroom"
        :setTimeDialogShow="setTimeDialogShow"
        :currentMode="page_model"
        :isDashboard="isDashboard"
        :closeBtn="closeDashCopy"
      />
    </el-dialog>

    <el-dialog title="Set feedback failure" :visible.sync="showTimeSetDialog">
      <feedbackTimePanel
        :mode="mode"
        :changeFeedbackTimeMode="changeFeedbackTimeMode"
        :confirm="hindeTimeDialog"
      />
    </el-dialog>

    <!-- custom-class="custom-dialog" @open="openCopyLinkDialog()" -->
    <!-- title="Share this link with your students"       <copyLinkDialog
        v-if="classRoomInfo"
        :getStudentOnLineCount="getStudentOnLineCount"
        :url="getStudentUrl()"
        :copyLink="copyLink"
        :getBtnString="getBtnString"
        :enterClassroom="enterClassroom"
        :setTimeDialogShow="setTimeDialogShow"
        :currentMode="page_model"
        :isDashboard="isDashboard"
        :closeBtn="closeCopyDialog"
    />-->

    <!--  -->
    <el-dialog
      :visible.sync="showCopyLinkDialog"
      custom-class="custom-dialog"
      @close="closeCopyLinkDialog()"
    >
      <AnonymousLogin
        style="width: 937px; height: 660px"
        v-if="classRoomInfo"
        :hindeTimeDialog="hindeTimeDialog"
        :url="getStudentUrl()"
        :copyLink="copyLink"
        :enterClassroom="enterClassroom"
        :closeBtn="closeCopyDialog"
      />
    </el-dialog>

    <el-dialog :visible.sync="showNewPromptDialog" custom-class="custom-dialog">
      <new-prompt-page
        style="width: 1150px; height: 900px"
        :addPPTItem="addPPTItem"
        :closeBtn="closeNewPrompt"
      />
    </el-dialog>
    <el-dialog
      :visible.sync="dashTipsModalVisiable"
      custom-class="custom-dialog"
      width="80%"
    >
      <dash-tips-modal :close="showDashTips" :isTeacher="false" />
    </el-dialog>
    <div
      v-show="shareing"
      style="
        width: 300px;
        height: 200px;
        position: absolute;
        top: 10px;
        left: 100px;
        background-color: green;
        padding: 25px;
      "
    >
      <video ref="screen-share" width="200" height="200" autoplay />
    </div>
  </div>
</template>

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
  getAVComment,
  saveUserConfig,
  getAllGroupMember,
} from "../model/index";
import {
  initTeacherData,
  getTeacherCurrentPageAnswerList,
  addTeacherData,
} from "@/model/data.teacher";
import { initTeacherCommentData } from "@/model/comment.teacher";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import { createSo, setTeacherWxBaseParams } from "../socket/socket.teacher";
import {
  ModalEventsNameEnum,
  SocketEventsEnum,
  ClassRoomModelEnum,
} from "../socket/socketEvents";
import {
  getTeacherStoreToken,
  saveTeacherStoreToken,
  saveStepOneStatus,
  initTeacherStoreSlideId,
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
import AnonymousLogin from "../components/teacher/AnonymousLogin.vue";
import dashCopyDialog from "../components/teacher/dashCopyDialog";
import StudentPacedNote from "@/components/teacher/studentPacedNote.vue";
import StudentsQsModal from "@/components/teacher/studentsQsModal.vue";
import DashHeader from "@/components/teacher/dashHeader.vue";
import dashTipsModal from "@/components/teacher/dashTipsModal.vue";
import { openShare } from "@/utils/shareScreen";
import { mapActions, mapState } from "vuex";
import NewPromptPage from "@/components/teacher/newPromptPage.vue";
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
    AnonymousLogin,
    StudentPacedNote,
    StudentsQsModal,
    DashHeader,
    dashCopyDialog,
    dashTipsModal,
    NewPromptPage,
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
      markupslist: [], // ppt comment列表
      allAddedMediaList: [],
      meterialVisiable: false,
      overviewModalVisiable: false,
      dashTipsModalVisiable: false,
      firstJoined: true,
      copyLinkStr: "",
      shareing: false,
      showNewPromptDialog: false,
      inputDialog: false,
    };
  },
  mounted() {
    EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, (data) => {
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

    EventBus.$on(ModalEventsNameEnum.ADD_NEW_MEDIA, (url) => {
      this.addMediaList(url);
    });
    EventBus.$on(ModalEventsNameEnum.UPDATE_MEDIA_ELEMENT, (data) => {
      this.updateMediaList(data);
    });
    EventBus.$on(ModalEventsNameEnum.DELETE_MEDIA_ELEMENT, (data) => {
      this.deleteMedia(data);
    });
  },
  computed: {
    ...mapState({
      currentPageIndex: (state) => state.student.currentPageIndex,
    }),
    currentPageId() {
      if (this.slides[this.currentPageIndex]) {
        return this.slides[this.currentPageIndex].page_id;
      } else {
        return "p";
      }
    },
    // filterMarkupList() {
    //   if (this.currentPageId) {
    //     // console.log(this.currentPageId);
    //     const list = this.markupslist.filter(
    //       item => item.data.page_id === this.currentPageId
    //     );
    //     return list;
    //   }
    //   return [];
    // },
    // meterial 数据
    filterAddedMediaList() {
      if (this.slides[this.currentPageIndex]) {
        return this.slides[this.currentPageIndex].elements.filter(
          (item) => item.type !== "tip" && item.position
        );
      } else {
        return [];
      }
    },
    filterTips() {
      if (this.slides[this.currentPageIndex]) {
        return this.slides[this.currentPageIndex].elements.filter(
          (item) => item.type === "tip"
        );
      } else {
        return [];
      }
    },
  },
  watch: {
    studentList() {
      this.setStudentList(this.studentList);
    },
    currentPageIndex() {
      this.sendPageChangeToStudents();
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const { id } = vm.$route.params;
      const { token, p } = to.query;
      // vm.slide_id = slide_id;
      vm.class_id = id;
      window.classId = id;
      const index = to.query.p ? to.query.p : 0;
      vm.setStudentPageIndex(index);
      vm.isDashboard = vm.$route.name === "d";
      // console.log(vm.isDashboard)
      // vm.directFromPlugin = to.query.direct ? true : false;
      initTeacherStoreSlideId(id);
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
    ...mapActions("teacher", ["setStudentList", "setAllGroups"]),
    ...mapActions("student", [
      "setStudentAllSlides",
      "setStudentPageIndex",
      "updateAllAnswerdList",
      "setAllAnswerdList",
      "deleteOnAnswerById",
    ]),
    ...mapActions("remark", [
      "showRemarkModal",
      "setAllRemarkList",
      "updateLatestRemarkId",
      "addOneRemarkItem",
      "updateOneRemarkItem",
      "deleteOneRemarkItem",
    ]),
    addprompt() {
      console.log("新增prompt!!");
      this.showNewPromptDialog = true;
    },
    closeNewPrompt() {
      this.showNewPromptDialog = false;
    },
    addPPTItem(item) {
      console.log(item);
    },
    showInputDialog() {
      console.log("showInputDialog");
      this.inputDialog = true;
    },
    showDashTips() {
      this.dashTipsModalVisiable = !this.dashTipsModalVisiable;
    },
    addMediaList({ url, type }) {
      const page_id = this.currentPageId;
      const itemData = JSON.stringify({
        page_id: page_id,
        url: url,
        type: type,
        position: { x: 0, y: 0, w: 0, h: 0 },
      });
      this.currentSo.emit(
        SocketEventsEnum.TEACHER_ADD_MEDIA,
        `{"token": "${this.token}","class_id":"${this.class_id}", "slide_id": "${this.slide_id}","page_id": "${page_id}", "data": ${itemData}}`
      );
    },
    updateMediaList(data) {
      const page_id = this.currentPageId;
      const itemData = JSON.stringify({ page_id: page_id, ...data });
      this.currentSo.emit(
        SocketEventsEnum.TEACHER_UPDATE_MEDIA,
        `{"token": "${this.token}","class_id":"${this.class_id}", "slide_id": "${this.slide_id}","page_id": "${page_id}", "id": "${data.id}", "data": ${itemData}}`
      );
    },
    deleteMedia(id) {
      // delete-element
      // request: {"token": "", "class_id", "id": 1}
      // console.log(id);
      this.currentSo.emit(
        SocketEventsEnum.TEACHER_DELETE_MEDIA,
        `{"token": "${this.token}","class_id":"${this.class_id}", "slide_id": "${this.slide_id}","page_id": "${this.currentPageId}", "id": "${id}"}`
      );
    },
    onLineStatusChanged(status) {
      this.onLine = status;
      if (status && this.firstJoined) {
        this.firstJoined = false;
        // 上线后的操作
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
      }
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
      let responseList = this.getCurrentPageAnswer();
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
                key: user_id,
              });
              const data = this.currentItemData;
              EventBus.$emit("choice", { data });
            } else if (itemData[0].type == "draw") {
              const user_id = studentId;
              const content = responseList[i].content;
              const content1 = responseList[i].content1;
              const user_name = responseList[i].user_name;
              addTeacherData(pageId, itemData[0].type, {
                user_id,
                content,
                content1,
                user_name,
                star: responseList[i].star,
                show: responseList[i].show,
                key: user_id,
              });
              EventBus.$emit("draw", { user_id, content, content1, user_name });
            } else if (
              itemData[0].type == "text" ||
              itemData[0].type == "number" ||
              itemData[0].type == "media"
            ) {
              const user_id = studentId;
              const content = responseList[i].content;
              const content1 = responseList[i].content1;
              const user_name = responseList[i].user_name;
              const item_id = responseList[i].item_id;
              addTeacherData(pageId, itemData[0].type, {
                user_id,
                content,
                content1,
                user_name,
                item_id,
                star: responseList[i].star,
                show: responseList[i].show,
                key: `${item_id}_${user_id}`,
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
      commentType,
      answertime,
    }) {
      const itemData = JSON.stringify({
        type: SocketEventsEnum.TEACHER_COMMENT,
        studentId,
        pageId,
        page_id: pageId,
        itemId,
        title,
        time,
        value,
        commentType,
        teacherName,
        slideIndex: parseInt(this.currentPageIndex) + 1,
        room: this.slide_id,
        answertime,
      });
      // // console.log(itemData);
      this.currentSo.emit(
        "comment",
        `{"user_id":"${studentId}","token": "${this.token}","class_id":"${this.class_id}", "item": ${itemData}}`
      );
      // this.currentSo.emit('comment', `{"user_id":"${studentId}", "item": {"id":"item_1", "response_index": 0}}`, data => {// console.log("发送消息反馈")});
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
            // console.log(profile.config);
            if (!this.directFromPlugin) {
              return;
            }
            if (profile.config && profile.config.length > 0) {
              for (let i = 0; i < profile.config.length; i++) {
                if (profile.config[i].key === "dashboard_step_one_hide") {
                  if (profile.config[i].value === "1") {
                    this.stepTwoDialog = true;
                    return;
                  }
                  break;
                }
              }
            }
            this.stepOneDialog = true;
          }
        });
      }
    },

    goToLogin() {
      getTeacherLoginUrl().then((url) => {
        // console.log(url);
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
    // 短连接参数配置
    initShortLinkConfig(res) {
      // res
      // author: "yujj085@gmail.com"
      // class_id: "543aad87"
      // class_name: "unnamed"
      // date: 1629208269
      // file_name: "ClasscipeDev"
      // id: 359
      // lock_page: []
      // mode: "student-paced"
      // response_limit_mode: 0
      // response_limit_time: 0
      // slide_id: "1-oo7FBGrusK0UulTEA4OQpFo_rMWFsrq9cOEEMLNFzM"
      // status: "live"
      // type: "slide"
      this.slide_id = res.slide_id;
      // this.currentPageIndex = 0;
      this.directFromPlugin = false;
    },
    startConnectRoom() {
      queryClassStatus(this.class_id, this.token)
        .then((res) => {
          this.initShortLinkConfig(res);
          this.classRoomInfo = res;
          if (this.directFromPlugin) {
          }
          this.afterConnectRoom();
        })
        .catch((res) => {
          // console.log(res);
        });
    },
    afterConnectRoom() {
      this.joinRoom();
      requestRefreshPPT(this.slide_id, this.token)
        .then((res) => {
          // // console.log(res);
          if (res.data.task_id) {
            let code = res.data.task_id;
            this.queryResult(code, this.token, 0);
          } else {
            this.getAllSlides();
            hideLoading();
          }
        })
        .catch((res) => {
          // console.log(res, "net request error!!");
          this.getAllSlides();
          hideLoading();
        });
      getOnlineUsers(this.token, this.class_id)
        .then((res) => {
          if (res.code == "ok") {
            let list = res.data;
            for (let i = 0; i < list.length; i++) {
              let { user_id, role, user_name } = list[i];
              // console.log(user_id, role, user_name);
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
        .catch((res) => {});

      getAVComment(this.class_id, this.token)
        .then((res) => {
          // console.log(res);
          if (res.code == "ok") {
            this.markupslist = res.data;
            let marks = [];
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].data.user_id = res.data[i].user_id;
              res.data[i].data.user_name = res.data[i].user_name;
              res.data[i].data.updated_at = res.data[i].data.time;
              marks.push(res.data[i].data);
            }
            // 初始化remark数据
            this.setAllRemarkList(marks);
          }
        })
        .catch((res) => {
          // console.log(res);
        });

      getAllGroupMember(this.class_id).then((list) => {
        console.log(this.class_id);
        this.setAllGroups(list);
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

      setTeacherWxBaseParams({
        classId: this.class_id,
        token: this.token,
        uid: this.uid,
        uname: teacher.name,
      });
    },
    msgListener(d) {
      // console.log(d);
      if (d.mtype === SocketEventsEnum.STUDENTS_COUNTS) {
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
                `{"room":"${this.class_id}", "token": "${this.token}","class_id":"${this.class_id}","type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentPageIndex}"}}`
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
      } else if (d.mtype === SocketEventsEnum.RENAME) {
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
            (item) => item != page
          );
        }
      } else if (d.type == SocketEventsEnum.STAR_OR_HIDE_ANSWER) {
        if (d.params) {
          const { pageId, itemId, title, studentId, nextStatus, type } =
            d.params;
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
      } else if (d.mtype == SocketEventsEnum.STUDETN_GO_PAGE) {
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
        // console.log(d.params, SocketEventsEnum.SET_DEADLINE_TIME);
      } else if (d.type == SocketEventsEnum.COPY_LINK_DIALOG_CLOSE) {
        this.firstCloseCopyLinkDialog = false;
        this.showCopyLinkDialog = false;
        this.stepTwoDialog = false;
      } else if (d.type == SocketEventsEnum.COPY_LINK_DIALOG_OPEN) {
        if (this.isDashboard) {
          this.stepTwoDialog = true;
        } else {
          this.showCopyLinkDialog = true;
          this.copyLinkStr = "";
        }
      } else if (d.mtype === SocketEventsEnum.STUNDENT_COMMENT_PPT) {
        // 评论ppt消息
        this.markupslist.push(d);
        this.addOneRemarkItem({
          ...d,
          ...d.data,
        });
        this.getResponeCount();
        return;
      } else if (d.mtype === SocketEventsEnum.STUDENT_DELETE_PPT) {
        // 删除评论ppt消息
        const index = this.markupslist.findIndex((item) => item.id === d.id);
        // console.log("删除", index);
        this.markupslist.splice(index, 1);
        this.deleteOneRemarkItem(index);
        this.$forceUpdate();
        return;
      } else if (d.mtype === SocketEventsEnum.STUDENT_UPDATE_COMMENT) {
        // 更新
        this.updateOneRemarkItem({
          ...d,
          ...d.ppt_comment,
          id: d.ppt_comment_id,
        });
        this.$forceUpdate();
        return;
      } else if (d.mtype === SocketEventsEnum.STUDENT_ADD_MEDIA) {
        // const index = this.slides.findIndex(item => d.page_id === item.page_id)
        // this.slides[index].elements.push(d.data)
        // console.log("this.allAddedMediaList", "STUDENT_ADD_MEDIA");
        // const page_id = this.currentPageId
        this.slides[this.currentPageIndex].elements.push({
          id: d.id,
          ...d.data,
        });
      } else if (d.mtype === SocketEventsEnum.TEACHER_UPDATE_MEDIA) {
        // this.slides[index].elements.push(d.data)
        const { id } = d.data;
        const list = this.slides[this.currentPageIndex].elements;
        const itemIndex = list.findIndex((item) => id === item.id);
        const nextData = { id: d.id, ...d.data };
        if (!window.isWindowActive) {
          this.slides[this.currentPageIndex].elements.splice(itemIndex, 1);
          this.$nextTick(() => {
            this.slides[this.currentPageIndex].elements.splice(
              itemIndex,
              0,
              nextData
            );
          });
        } else {
          this.slides[this.currentPageIndex].elements.splice(
            itemIndex,
            1,
            nextData
          );
        }
        // this.$nextTick(() => {
        //   // console.log('notUpdate ==== window elementNotUpdate')
        //   window.elementNotUpdate = false
        // })
        // const page_id = this.currentPageId
        // this.slides[this.currentPageIndex].elements.push(d.data)
      } else if (d.mtype === SocketEventsEnum.TEACHER_DELETE_MEDIA) {
        // this.slides[index].elements.push(d.data)
        const { id } = d;
        const list = this.slides[this.currentPageIndex].elements;
        const itemIndex = list.findIndex((item) => id === item.id);
        this.slides[this.currentPageIndex].elements.splice(itemIndex, 1);
      } else if (d.mtype === SocketEventsEnum.DELETE_QUESTION) {
        this.deleteOnAnswerById(d.response_id);
        this.getResponeCount();
      }

      // 回答问题
      const { room, page_id } = d;
      // 过滤非当前页面数据 是否需要过滤当前页面？？ page_id !== this.currentPageId
      if (room != this.class_id) return;

      let newList = [];
      if (d.type === "media") {
        // media数据是递增的
        const { type } = d;
        newList = addTeacherData(page_id, type, d);
        // this.updateAllAnswerdList(d)
        // return
      }
      // 回答choice
      if (d.type === "choice") {
        const { answer, user_id, type } = d;
        newList = addTeacherData(page_id, type, {
          user_id,
          answer,
          star: false,
          show: true,
          key: user_id,
          ...d,
        });
        const data = this.currentItemData;
        EventBus.$emit("choice", { data });
      } else if (
        d.type == SocketEventsEnum.TEXT_INPUT ||
        d.type === SocketEventsEnum.NUMBER_INPUT
      ) {
        //接收到text input或者number input的值
        const { content, user_id, user_name, item_id, type } = d;
        newList = addTeacherData(page_id, type, {
          user_id,
          content,
          user_name,
          item_id,
          star: false,
          show: true,
          key: `${item_id}_${user_id}`,
          ...d,
        });
        EventBus.$emit(d.type, { user_id, page_id, item_id });
      } else if (d.type === SocketEventsEnum.DRAW_CANVAS) {
        const { content, content1, type, user_id, user_name } = d;
        newList = addTeacherData(page_id, type, {
          user_id,
          content,
          content1,
          star: false,
          show: true,
          key: user_id,
          user_name,
          ...d,
        });
        EventBus.$emit("draw", { user_id, content, content1, user_name });
      } else if (d.type == SocketEventsEnum.MEDIA_INPUT) {
        // console.log(d);
        // const { content, user_id, user_name, item_id, type } = d;
        // newList = addTeacherData(page_id, type, {
        //   user_id,
        //   content,
        //   user_name,
        //   item_id,
        //   star: false,
        //   show: true,
        //   key: `${item_id}_${user_id}`
        // });
        // EventBus.$emit(d.mtype, { user_id, page_id, item_id });
      }
      if (newList && newList.length > 0) {
        this.setAllAnswerdList(newList);
      }
      this.getResponeCount();
    },

    pageChange(value, notSend) {
      // console.log(value, "pageChage!!!" + this.isDashboard);
      if (this.isDashboard) {
        this.giveFocus(value - 1, notSend);
        return;
      }
      this.setStudentPageIndex(value - 1);
    },

    sendPageChangeToStudents() {
      this.questionModalVisiable = false; //与控制面板中的comment显示与否的按钮保持同步
      this.getItemData();
      const notSend = false;
      if (!notSend && this.page_model != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.class_id}", "token": "${this.token}","class_id":"${this.class_id}","type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentPageIndex}"}}`
        );
      }
    },

    queryResult(code, token, count) {
      let _this = this;
      // if (count < 20) {
      //   queryRefreshResult(code, token)
      //     .then((res) => {
      //       if (res.data.status === "processing") {
      //         setTimeout(function() {
      //           _this.queryResult(code, token, ++count);
      //         }, 1000);
      //       } else {
      //         this.getAllSlides();
      //         hideLoading();
      //       }
      //     })
      //     .catch((res) => {
      //       this.getAllSlides();
      //       hideLoading();
      //     });
      // } else {
      //   this.getAllSlides();
      //   hideLoading();
      // }
      queryRefreshResult(code, token)
        .then((res) => {
          if (res.data.status === "processing") {
            setTimeout(function () {
              _this.queryResult(code, token);
            }, 1000);
          } else {
            this.getAllSlides();
            hideLoading();
          }
        })
        .catch((res) => {
          this.getAllSlides();
          hideLoading();
        });
    },
    getAllSlides() {
      // 初始化评论数据
      initTeacherCommentData(this.class_id, this.token);
      Promise.all([
        initTeacherData(this.class_id, this.token),
        getAllPPTS(this.slide_id),
      ]).then(([allA, { pages: list, elements = [] }]) => {
        // console.log(list);
        // vuex缓存答案
        this.setAllAnswerdList(allA);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        // vuex 缓存全局slides
        this.setStudentAllSlides(list);
        this.allAddedMediaList = elements.filter((item) => item.type !== "tip");
        // this.allTips = elements.filter(item => item.type === "tip");
        this.getItemData();
        for (let i = 0; i < list.length; i++) {
          this.responsePercentage[i] = 0;
        }
        this.isFocus[this.currentPageIndex] = true;
      });
    },
    getItemData() {
      // this.options = [];
      this.currentItemData = null;
      // console.log('getItemData', 'null')
      this.$nextTick(() => {
        this.currentItemData =
          this.slides[this.currentPageIndex] || this.slides[0];
        // console.log('getItemData', this.currentItemData)
        this.currentItemData.flag = this.isDashboard;
        this.getResponeCount();
      });
    },
    getCurrentPageAnswer() {
      const { type } = this.currentItemData.items[0];
      const { page_id } = this.currentItemData;
      if (type !== "comment") {
        let list = this.$store.state.student.allAnswerList.filter(
          (item) => item.page_id === page_id
        );
        // console.log(list, "lentth");
        return list;
      } else {
        // comment remark 特殊，数据不在answer内
        let list = this.$store.state.remark.allRemarks.filter(
          (item) => item.page_id === page_id
        );
        return list;
      }
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
        const list = this.getCurrentPageAnswer();
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
          this.responsePercentage[this.currentPageIndex] = 0;
        } else {
          this.responsePercentage[this.currentPageIndex] =
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
    closeCopyDialog() {
      this.showCopyLinkDialog = false;
    },

    getBtnString() {
      if (this.getStudentOnLineCount() == 0) {
        this.copyLinkBtnString = "Waiting for students..";
      } else if (this.currentPageIndex == 0) {
        this.copyLinkBtnString = "Start Class";
      } else {
        this.copyLinkBtnString = "Continue";
      }
      return this.copyLinkBtnString;
    },

    getStudentUrl(anonymous) {
      if (!anonymous) {
        anonymous = false;
      }
      if (!this.page_model) {
        this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
      }
      const url = `${location.origin}/s/${this.class_id}?anonymouse=${anonymous}`;
      return url;
    },

    copyLink(anonymous) {
      copy(this.getStudentUrl(anonymous));
      if (this.copyLinkStr && this.copyLinkStr.length > 0) {
      } else {
        showToast("copy link success");
        this.copyLinkStr = this.getStudentUrl();
      }

      // this.showCopyLinkDialog = false;
      // this.stepTwoDialog = false;
    },

    emitSo(message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit("control", message);
      }
    },

    closeDashCopy() {
      this.stepTwoDialog = false;
    },

    turnModel() {
      // console.log(this.page_model);
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
            `{"room":"${this.class_id}", "token": "${this.token}","class_id":"${this.class_id}","type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentPageIndex}"}}`
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
      // console.log(this.slide_id);
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
      // console.log(name);
      if (!name) {
        name = this.classRoomInfo.class_name;
      }
      showLoading();

      endClassRoomReq(this.token, name, this.class_id)
        .then((res) => {
          // console.log(res);
          let _this = this;
          this.confirmCloseDialogVisible = false;
          if (res.code == "ok") {
            this.emitSo(
              `{"room":"${this.class_id}", "type": "${SocketEventsEnum.CHANGE_SESSION_STATUS}", "token": "${this.token}","class_id":"${this.class_id}","params": {"status": "close"}}`
            );
            setTimeout(function () {
              hideLoading();
              let url =
                "https://docs.google.com/presentation/d/" + _this.slide_id;
              window.location.href = url;
            }, 2000);
          }
        })
        .catch((res) => {
          // console.log(res);
          this.$message("error", "Close Session error");
          hideLoading();
        });
      //结束课程
    },
    lockPage() {
      let islocked = true;
      let page_id = this.slides[this.currentPageIndex].page_id;
      if (!this.classRoomInfo.lock_page) {
        islocked = true;
        this.classRoomInfo.lock_page = new Array();
        this.classRoomInfo.lock_page.push(page_id);
      } else {
        let pages = this.classRoomInfo.lock_page.filter(
          (item) => item != page_id
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
            this.slides[this.currentPageIndex].page_id
          }"}}`
        );
      }
    },
    enterClassroom() {
      this.showCopyLinkDialog = false;
    },
    openProject() {
      const url = `${location.origin}/t/${this.class_id}?p=${this.currentPageIndex}`;
      window.open(url);
    },
    open(model) {
      if (model == 0) {
        // console.log(0 + "_blank");
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
        windowObjectReference.location = `/d/${this.class_id}?p=${this.currentPageIndex}`;
      } else if (model == 1) {
        // console.log(1);
        window.open(`/d/${this.class_id}?p=${this.currentPageIndex}`);
      }
    },

    //显示当前的学生
    showStudents() {
      this.dialogTableVisible = true;
    },

    closeStudents() {
      this.dialogTableVisible = false;
    },

    //重新开启课堂
    _reopenClass() {
      reopenClass(this.token, this.class_id)
        .then((res) => {
          // console.log(res);
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
        .catch((res) => {
          // console.log(res);
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
      // console.log(index, notSend, 'giveFocus')
      this.setStudentPageIndex(index);
      this.currentItemData = this.slides[index];
      this.currentItemData.flag = this.isDashboard;
      this.getResponeCount();
      if (!notSend && this.page_model != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.class_id}", "type": "${SocketEventsEnum.GO_PAGE}","token": "${this.token}","class_id":"${this.class_id}", "params": {"page": "${this.currentPageIndex}"}}`
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
        // console.log(mode, deadline.getTime());
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
      // if (this.firstCloseCopyLinkDialog) {
      // console.log("close copy link dialog!!");
      this.firstCloseCopyLinkDialog = false;
      this.emitSo(
        `{"room":"${this.class_id}", "type": "${SocketEventsEnum.COPY_LINK_DIALOG_CLOSE}","token": "${this.token}","class_id":"${this.class_id}"}`
      );
      // }
    },
    openCopyLinkDialog() {
      // console.log("open copy link dialog!!");
      this.emitSo(
        `{"room":"${this.class_id}", "type": "${SocketEventsEnum.COPY_LINK_DIALOG_OPEN}","token": "${this.token}","class_id":"${this.class_id}"}`
      );
    },
    hideStepOne() {
      saveStepOneStatus(this.classRoomInfo.author, "true");
      saveUserConfig(this.token, "dashboard_step_one_hide", "1")
        .then((res) => {
          // console.log(res);
        })
        .catch((res) => {
          // console.log(res);
        });
      this.stepTwoDialog = true;
      this.stepOneDialog = false;
    },
    changeShowMetrial(status) {
      this.meterialVisiable = status;
    },
    shareScreen() {
      openShare(() => {
        this.$refs["screen-share"].srcObject = null;
        this.shareing = false;
      }).then((stream) => {
        this.$refs["screen-share"].srcObject = stream;
        this.shareing = true;
      });
    },
  },
};
</script>

<style lang="scss">
.custom-dialog.el-dialog {
  // padding: 0;
  // width: 937px;
  // height: 770px;
  background-color: #f00fff00;
  border: 0px solid #00000000;
  // border-radius: 8px;
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
  padding-top: 50px;
  padding-bottom: 60px;
  box-sizing: border-box;
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
  background-color: #f4f4f4;
}
.control {
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0%;
  left: 0%;
  background-color: #000000af;
  z-index: 999;
}
.top_btn {
  position: fixed;
  padding: 0 20px;
  height: 50px;
  top: 0;
  align-items: center;
  z-index: 999;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
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
  margin-right: 20px;
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
  background-color: #f4f4f4;
  overflow: hidden;
}
.readchat {
  display: flex;
}
</style>
    