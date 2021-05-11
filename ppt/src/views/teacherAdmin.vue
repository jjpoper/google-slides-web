<template>
  <el-container>
    <el-main>
      <div class="block" v-if="currentItemData && currentItemData.thumbnail_url">
        <pptcontent v-if="!showResponse" :url="currentItemData.thumbnail_url" :teacher="true" />
        <teacherIndexItem
          v-else-if="currentItemData && currentItemData.items[0]"
          :data="currentItemData"
          :type="currentItemData.items[0].type"
          :flag="false"
          :currentAnswerCount="currentAnswerCount"
          :textList="responseContentList"
        />
        <teacherControlPanel
          class="control_panel"
          :current_model="page_model"
          :currentPage="parseInt(currentIndex) + 1"
          :totalPage="slides.length"
          :isDashboard="false"
          :changePage="pageChange"
          :turnModel="turnModel"
          :open="open"
          :showResponse="showres"
          :current_response="currentAnswerCount"
          :isResponseShow="showResponse"
          :slide_id="slide_id"
          :endLesson="endLesson"
          :turnOff="turnModel"
        />
      </div>
    </el-main>
    <commentModal />
    <div class="share_room" @click="copyUrl()">Share Class</div>

    <el-dialog title="Ending Session" :visible.sync="dialogVisible">
      <div class="dialog_page">
        <strong>Your session is currently in Student-Paced Mode. Are you sure you want to end your session?</strong>

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
  </el-container>
</template>
<style scoped>
.response_page {
  min-height: 200px;
  height: 100%;
}
.dropdown-class {
  position: absolute;
  right: 10px;
  bottom: 20px;
}
.dropdown-icon {
  width: 20px;
  height: 40px;
  position: absolute;
  right: 10px;
  bottom: 20px;
  line-height: 40px;
  overflow: hidden;
}
.block {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.invite {
  position: absolute;
  right: 160px;
  bottom: 20px;
}
.counts {
  position: absolute;
  left: 10px;
  bottom: 20px;
  background-color: transparent !important;
  border: none !important;
  color: #333;
}
.show_student {
  position: absolute;
  right: 50px;
  bottom: 20px;
}
.Show {
  position: absolute;
  right: 270px;
  bottom: 20px;
}
.noShow {
  position: absolute;
  left: 280px;
  bottom: 20px;
}
.Presenting {
  position: absolute;
  left: 180px;
  bottom: 20px;
  background-color: transparent !important;
  border: none !important;
  color: #333;
}
.gray {
  background-color: transparent !important;
  border: none !important;
  color: #333;
}
.modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.2);
}
.shareBox {
  width: 300px;
  height: 200px;
  background-color: #fff;
  position: relative;
  margin: 0 auto;
}
.control_panel {
  width: 100%;
  position: fixed;
  left: 0%;
  bottom: 0%;
}
.share_room {
  width: 100px;
  height: 30px;
  position: fixed;
  text-align: center;
  right: 50px;
  top: 20px;
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border-radius: 5px;
  padding-top: 10px;
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
</style>
<script>
import { MessageBox } from "element-ui";
import copy from "copy-to-clipboard";
import pptcontent from "../components/pptcontent";
import {
  getAllPPTS,
  getTeacherLoginUrl,
  getUserProfile,
  requestRefreshPPT,
  queryRefreshResult
} from "../model/index";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import teacherIndexItem from "../components/teacher/Index";
import studentList from "../components/teacher/studentList";
import { createSo } from "../socket/socket.teacher";
import dashboardMenu from "../components/teacher/teacherDashboardMenu";
import {
  ModalEventsNameEnum,
  SocketEventsEnum,
  ClassRoomModelEnum
} from "../socket/socketEvents";
import {
  getTeacherUid,
  saveStundentUidAndName,
  saveStudentsPageAnswerList,
  getCurrentPageAnswerList,
  saveTeacherUserName,
  getTeacherUserName,
  getTeacherStoreToken,
  saveTeacherStoreToken
} from "@/model/store.teacher";
import commentModal from "../components/teacher/commentModal";
import teacherControlPanel from "../components/teacher/teacherControlPanel";
// import {
//   checkGoogleAuth,
//   gotoGoogleAuth,
//   initGoogleAuth,
//   getGoogleUserInfo,
// } from "@/utils/googleAuth";

export default {
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
      dialogVisible: false
    };
  },
  mounted() {
    // initGoogleAuth()
    //   .then(() => {
    //     const isLogin = checkGoogleAuth();
    //     console.log(isLogin, "isLogin");
    //     if (isLogin) {
    //       // this.afterLogin()
    //       this.afterLogin();
    //     } else {
    //       this.showLoginModal();
    //     }
    //   })
    //   .catch(() => {
    //     this.startConnectRoom();
    //   });
    EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, data => {
      this.sendComment(data);
    });
  },
  computed: {
    currentPageId() {
      return this.slides[this.currentIndex].page_id;
    }
  },
  components: {
    pptcontent,
    teacherIndexItem,
    commentModal,
    studentList,
    dashboardMenu,
    teacherControlPanel
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      const { slide_id, token } = to.query;
      vm.slide_id = slide_id;
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
          `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.MODEL_CHANGE}", "params": {"model": "${this.page_model}"}}`
        );
      }
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
    open(model) {
      // this.$router.push({ path: "/dashboard" });

      if (model == 0) {
        console.log(0 + "_blank");
        var windowObjectReference;
        var strWindowFeatures =
          "width=800,height=600,menubar=yes,location=yes,resizable=yes,scrollbars=true,status=true,top=100,left=200";

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
          "/index.html#/dashboard?slide_id=" +
          this.slide_id +
          "&currentPage=" +
          this.currentIndex +
          "&model=" +
          this.page_model;
      } else if (model == 1) {
        console.log(1);
        window.open(
          "/index.html#/dashboard?slide_id=" +
            this.slide_id +
            "&currentPage=" +
            this.currentIndex +
            "&model=" +
            this.page_model
        );
      }
    },
    afterLogin({ user_name, email }) {
      this.name = user_name;
      this.uid = email;
      // saveTeacherUserName(name);
      this.startConnectRoom();
    },
    startConnectRoom() {
      this.joinRoom();
      this.openShare();
      this.getAllSlides();
          hideLoading();
          return
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
      //todo  检查更新完毕后，再获取ppt
    },

    queryResult(code, token, count) {
      let _this = this;
      if (count < 2) {
        queryRefreshResult(code, token)
          .then(res => {
            if (res.data.status === "processing") {
              setTimeout(function() {
                _this.queryResult(code, token, ++count);
              }, 2000);
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
        `{"user_id":"${studentId}", "item": ${itemData}}`
      );
      // this.currentSo.emit('comment', `{"user_id":"${studentId}", "item": {"id":"item_1", "response_index": 0}}`, data => {console.log("发送消息反馈")});
      // this.emitSo(itemData)
    },
    getResponeCount() {
      // console.log("getResponeCount=="+this.type)
      // if(this.type == 'choice'){
      //   return this.answerList.length
      // }else if(this.type == SocketEventsEnum.TEXT_INPUT||this.type==SocketEventsEnum.NUMBER_INPUT){
      //   console.log(this.textList.length)
      //   return this.textList.length;
      // }else{
      //   return 0;
      // }
      if (this.currentItemData.items[0]) {
        const list = getCurrentPageAnswerList(
          this.currentItemData.page_id,
          this.currentItemData.items[0].type
        );
        console.log(list);
        this.currentAnswerCount = list.length;

        this.responseContentList = list;
      } else {
        this.currentAnswerCount = 0;
      }
    },
    getAllSlides() {
      getAllPPTS(this.slide_id).then(list => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        this.getItemData();
      });
    },
    getItemData() {
      // this.options = [];
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentIndex];
        this.currentItemData.flag = false;
        this.getResponeCount();
        // if (choice && choice.data) {
        //   const { title, options } = choice.data;
        //   this.title = title;
        //   this.type = choice.type;
        //   console.log("item type =="+ this.type)
        //   this.options = options;
        //   this.textList = getTeacherDatalist(this.currentPageId,this.type)
        //   this.answerList = getTeacherAlist(this.currentPageId);
        // }
      });
    },
    pageChange(value, notSend) {
      console.log(value, "pageChage!!!");
      this.currentIndex = value - 1;
      this.getItemData();
      // 换页命令
      // '{"type":"change_page", "params": {"page": 3}}'

      if (!notSend && this.page_model != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
        );
      }
    },
    copyUrl() {
      if (!this.page_model) {
        this.page_model = ClassRoomModelEnum.TEACHER_MODEL;
      }
      const url = `${location.origin}${location.pathname}#/students?slide_id=${this.slide_id}&page=${this.currentIndex}&model=${this.page_model}`;
      copy(url);
      showToast("copy link success");
    },
    //显示当前的学生
    showStudents() {
      this.dialogTableVisible = true;
    },
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.token, this.msgListener);
      let teacher = new Object();
      teacher.name = this.name ? this.name : "A teacher";
      teacher.state = "online";
      teacher.user_id = this.uid;
      this.teacherList.push(teacher);
    },
    msgListener(d) {
      // answer: "Lily"
      // item_id: "item_1"
      // page_id: "page_1"
      // room: "1KxKT-_j8Z1L4ag4waifI9hnDRm0C9yNnFt7VKwVVqCg"
      // user_id: "slidec3dcef92c1cf458c"
      console.log(d, d.mtype, "====收到消息命令");
      if (d.type === SocketEventsEnum.STUDENTS_COUNTS) {
        // 人数更新
        console.log(d.student_count, "d.student_count");
        this.studentCounts = d.student_count;
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
        saveStundentUidAndName(user_id, user_name_new);
        // this.user_name = user_name_new;
        // for (let i = 0; i < this.textList.length; i++) {
        //   if (user_id === this.textList[i].user_id) {
        //     let newVaule = this.textList[i];
        //     newVaule.user_name = user_name_new;
        //     //   Vue.set(this.textList, i, newValue);
        //   }
        // }
      } else if (d.type === SocketEventsEnum.GO_PAGE) {
        if (d.room == this.slide_id) {
          if (d.params) {
            // this.pageChange(d.params.page);
            this.current_page = parseInt(d.params.page) + 1;
            this.pageChange(this.current_page, true);
          }
        }
      } else if (d.type == SocketEventsEnum.MODEL_CHANGE) {
        if (d.room == this.slide_id) {
          this.page_model = d.params.model;
          console.log(this.page_model, "model change!!!");
        }
      } else if (d.type == SocketEventsEnum.SHOW_RESPONSE) {
        if (d.room == this.slide_id) {
          this.showResponse = d.params.response;
          console.log(this.showResponse, "show res change!!!");
        }
      }

      // 回答问题
      const { room, page_id } = d;
      // 过滤非当前页面数据
      if (room != this.slide_id || page_id !== this.currentPageId) return;
      // 回答choice
      if (d.type === SocketEventsEnum.ANSWER_QUESTION) {
        const { answer, user_id, type } = d;
        saveStudentsPageAnswerList(this.currentPageId, type, {
          user_id,
          answer,
          key: user_id
        });

        EventBus.$emit("choice", { user_id, answer });
      } else if (
        d.type == SocketEventsEnum.TEXT_INPUT ||
        d.type === SocketEventsEnum.NUMBER_INPUT
      ) {
        //接收到text input或者number input的值
        const { content, user_id, user_name, item_id, type } = d;
        saveStudentsPageAnswerList(this.currentPageId, type, {
          user_id,
          content,
          user_name,
          item_id,
          key: `${item_id}_${user_id}`
        });
      } else if (d.type === SocketEventsEnum.DRAW_CANVAS) {
        console.log(d);
        const { content, type, user_id, user_name } = d;
        saveStudentsPageAnswerList(this.currentPageId, type, {
          user_id,
          content,
          key: user_id,
          user_name
        });
        EventBus.$emit("draw", { user_id, content, user_name });
      }

      this.getResponeCount();
    },
    // '{"type":"change_page", "params": {"page": 3}}'
    emitSo(message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit("control", message);
      }
    },
    openShare() {
      // return
      const url = `${location.origin}${location.pathname}#/students?slide_id=${this.slide_id}&page=${this.currentIndex}`;
      console.log(url);
      MessageBox.confirm(url, "Share this link with your students", {
        distinguishCancelAndClose: true,
        confirmButtonText: "copy",
        cancelButtonText: "Enter classroom"
      })
        .then(() => {
          this.copyUrl();
        })
        .catch(action => {});
    },
    showres() {
      this.showResponse = !this.showResponse;
      this.emitSo(
        `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.SHOW_RESPONSE}", "params": {"response": ${this.showResponse}}}`
      );
    },
    endLesson(confirm) {
      if (!confirm && this.page_model == ClassRoomModelEnum.STUDENT_MODEL) {
        this.dialogVisible = true;
      } else {
        //离开
      }
    },
    leavePage() {
      let url = "https://dev.classcipe.com/";
      console.log(this.slide_id);
      if (this.slide_id) {
        window.location = url;
      }
    }
    // hideRes() {
    //   this.showResponse = false;
    //   this.emitSo(
    //     `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.SHOW_RESPONSE}", "params": {"response": "${this.showResponse}"}}`
    //   );
    // }
    // showLoginModal() {
    //   MessageBox.alert("press to login", "login", {
    //     distinguishCancelAndClose: true,
    //     confirmButtonText: "Login",
    //     center: true,
    //     showClose: false,
    //   })
    //     .then(() => {
    //       // this.copyUrl();
    //       console.log("点击登录");
    //       gotoGoogleAuth()
    //         .then(() => {
    //           this.afterLogin();
    //         })
    //         .catch(() => {
    //           this.showLoginModal();
    //         });
    //     })
    //     .catch((action) => {});
    // },
  }
};
</script>