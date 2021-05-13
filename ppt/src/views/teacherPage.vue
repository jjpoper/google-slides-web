<script>
import { MessageBox } from "element-ui";
import copy from "copy-to-clipboard";
import pptcontent from "../components/pptcontent";
import { getAllPPTS } from "../model/index";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import teacherIndexItem from "../components/teacher/Index";
import studentList from "../components/teacher/studentList";
import { createSo } from "../socket/socket.teacher";
import dashboardMenu from "../components/teacher/teacherDashboardMenu";
import {
  ModalEventsNameEnum,
  SocketEventsEnum,
  ClassRoomModelEnum,
} from "../socket/socketEvents";
import {
  getTeacherUid,
  saveStundentUidAndName,
  saveStudentsPageAnswerList,
  getCurrentPageAnswerList,
  saveTeacherUserName,
} from "@/model/store.teacher";
import commentModal from "../components/teacher/commentModal";
import {
  checkGoogleAuth,
  gotoGoogleAuth,
  initGoogleAuth,
  getGoogleUserInfo,
} from "@/utils/googleAuth";

export default {
  data() {
    return {
      showResponse: false, // 默认不展示老师的回答
      studentCounts: 0,
      slides: [],
      currentIndex: 0,
      slide_id: 0,
      currentSo: null,
      uid: getTeacherUid(), // uid
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
      isDashboard:false,
    };
  },
  mounted() {
    initGoogleAuth()
      .then(() => {
        const isLogin = checkGoogleAuth();
        console.log(isLogin, "isLogin");
        if (isLogin) {
          // this.afterLogin()
          this.afterLogin();
        } else {
          this.showLoginModal();
        }
      })
      .catch(() => {
        this.startConnectRoom();
      });
    EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, (data) => {
      this.sendComment(data);
    });
  },
  computed: {
    currentPageId() {
      return this.slides[this.currentIndex].page_id;
    },
  },
  components: {
    pptcontent,
    teacherIndexItem,
    commentModal,
    studentList,
    dashboardMenu,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.slide_id = to.query.slide_id;
      vm.page_model = to.query.model;
      vm.getAllSlides();
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
        this.currentSo.emit(SocketEventsEnum.MODEL_CHANGE, `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.MODEL_CHANGE}", "params": {"model": "${this.page_model}"}}`);
      }
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
    afterLogin() {
      const name = getGoogleUserInfo();
      console.log(name);
      this.name = name;
      saveTeacherUserName(name);
      this.startConnectRoom();
    },
    startConnectRoom() {
      this.joinRoom();
      this.openShare();
      hideLoading();
    },
    sendComment({
      studentId,
      pageId,
      itemId,
      title,
      time,
      value,
      teacherName,
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
        room: this.slide_id,
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
      showLoading();
      getAllPPTS(this.slide_id).then((list) => {
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
      console.log(value, notSend, "pageChage!!!");
      this.currentIndex = value - 1;
      this.getItemData();
      // 换页命令
      // '{"type":"change_page", "params": {"page": 3}}'

      if (!notSend) {
        this.emitSo(
          `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
        );
      }
    },
    copyUrl() {
      let url = location.href;
      url = url.substring(0, url.indexOf("&"));
      console.log(url);
      copy(
        `${url.replace(/teacher/, "students")}&page=${
          this.currentIndex
        }&model=${this.page_model}`
      );
      showToast("copy link success");
    },
    //显示当前的学生
    showStudents() {
      this.dialogTableVisible = true;
    },
    joinRoom() {
      this.currentSo = createSo(
        this.slide_id,
        this.uid,
        this.msgListener,
        this.name
      );
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
          key: user_id,
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
          key: `${item_id}_${user_id}`,
        });
      } else if (d.type === SocketEventsEnum.DRAW_CANVAS) {
        console.log(d);
        const { content, type, user_id, user_name } = d;
        saveStudentsPageAnswerList(this.currentPageId, type, {
          user_id,
          content,
          key: user_id,
          user_name,
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
      const url = `${location.href.replace(/teacher/, "students")}&page=${
        this.current
      }`;
      MessageBox.confirm(url, "Share this link with your students", {
        distinguishCancelAndClose: true,
        confirmButtonText: "copy",
        cancelButtonText: "Enter classroom",
      })
        .then(() => {
          this.copyUrl();
        })
        .catch((action) => {});
    },
    showres() {
      this.showResponse = true;
    },
    hideRes() {
      this.showResponse = false;
    },
    showLoginModal() {
      MessageBox.alert("press to login", "login", {
        distinguishCancelAndClose: true,
        confirmButtonText: "Login",
        center: true,
        showClose: false,
      })
        .then(() => {
          // this.copyUrl();
          console.log("点击登录");
          gotoGoogleAuth()
            .then(() => {
              this.afterLogin();
            })
            .catch(() => {
              this.showLoginModal();
            });
        })
        .catch((action) => {});
    },
  },
};
</script>