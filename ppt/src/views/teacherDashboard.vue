<template>
  <div class="dashboard">
    <div class="page">
      <div class="left">
        <div v-for="(item, index) in slides" :key="index" class="ppt_content">
          <div
            v-bind:class="
              isFocus[index]
                ? 'image_parent image_parent_focus'
                : 'image_parent '
            "
            @click="giveFocus(index)"
          >
            <img :src="item.thumbnail_url" />
          </div>

          <div class="response_flag">
            <div class="top" :style="'width:' + responsePercentage[index] + '%'"></div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="content_parent">
        <div class="content_main">
          <teacherIndexItem
            v-if="currentItemData && currentItemData.items[0]"
            :data="currentItemData"
            :type="currentItemData.items[0].type"
            :flag="true"
            :currentAnswerCount="currentAnswerCount"
            :textList="responseContentList"
          />
        </div>
      </div>
      <div class="number_info" @click="showStudents()">Class Roster {{ currentResponseCount }}/{{ studentCounts }}</div>

      <commentModal />
    </div>
    <teacherControlPanel
      class="control_panel"
      :current_response="currentResponseCount"
      :current_model="currentModel"
      :currentPage="parseInt(currentIndex) + 1"
      :totalPage="slides.length"
      :isDashboard="true"
      :changePage="giveFocus"
      :turnModel="turnModel"
    />

    <el-dialog title="Classroom Roster" :visible.sync="dialogTableVisible">
      <studentList :teacherList="teacherList" :studentList="studentList" />
    </el-dialog>
  </div>
</template>
<style scoped>
.dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.page {
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
}

.left {
  min-height: 100%;
  width: 250px;
  overflow: scroll;
  padding: 10px;
}

.left::-webkit-scrollbar {
  display: none;
}
.ppt_content {
  display: flex;
  flex-direction: column;
  width: 250px;
  overflow: hidden;
  margin-bottom: 10px;
}

.divider {
  height: auto;
  min-height: 100%;
  background-color: #909090;
  width: 1px;
  position: fixed;
  top: 0px;
  left: 250px;
}

.content_parent {
  display: flex;
  flex: 1;
  overflow-x: hidden;
}

.content_main {
  height: auto;
  width: 100%;
  background-color: white;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 70px;
  /* justify-content: center;
  align-items: center;
  flex-wrap: wrap; */
}
.number_info {
  position: fixed;
  right: 30px;
  top: 20px;
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

.image_parent {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid white;
  width: 230px;
  height: 130px;
}
.image_parent_focus {
  border: 1px solid #409eff;
}
image {
  width: 228px;
  height: auto;
  display: block;
}
.response_flag {
  width: 230px;
  height: 6px;
  background-color: white;
  border: 1px solid #909090;
}
.top {
  background-color: #67c23a;
  height: 6px;
}

.control_panel {
  width: 100%;
}
</style>
<script>
import { MessageBox } from "element-ui";
import copy from "copy-to-clipboard";
import pptcontent from "../components/pptcontent";
import { getAllPPTS, getTeacherLoginUrl, getUserProfile } from "../model/index";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import teacherIndexItem from "../components/teacher/Index";
import studentList from "../components/teacher/studentList";
import { createSo } from "../socket/socket.teacher";
import {
  ClassRoomModelEnum,
  ModalEventsNameEnum,
  SocketEventsEnum
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

export default {
  data() {
    return {
      showResponse: true, // 展示学生的回应
      studentCounts: 0,
      slides: [],
      currentIndex: 0,
      slide_id: 0,
      currentSo: null,
      uid: getTeacherUid(), // uid
      currentItemData: null,
      currentAnswerCount: 0,
      currentResponseCount: 0,
      responsePercentage: [],
      isFocus: [],
      currentSo: null,
      responseContentList: [],
      currentModel: ClassRoomModelEnum.TEACHER_MODEL,
      token: "",
      name: "",
      dialogTableVisible: false,
      teacherList: [],
      studentList: []
    };
  },
  mounted() {
    this.joinRoom();
    //   this.openShare();
    EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, data => {
      console.log("send comment!!");
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
    teacherControlPanel,
    studentList
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
      vm.currentIndex = to.query.currentPage;
      vm.currentModel = to.query.model;
    });
    // next(vm => {
    //   vm.slide_id = to.query.slide_id;
    //   vm.currentIndex = to.query.currentPage;
    //   vm.currentModel = to.query.model;
    //   vm.getAllSlides();
    // });
  },
  methods: {
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
            this.getAllSlides();
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
      this.uid = email;
      // saveTeacherUserName(name);
      this.startConnectRoom();
    },
    startConnectRoom() {
      this.joinRoom();
      //    this.openShare();
      hideLoading();
    },
    turnModel() {
      if (this.currentModel === ClassRoomModelEnum.STUDENT_MODEL) {
        this.currentModel = ClassRoomModelEnum.TEACHER_MODEL;
      } else {
        this.currentModel = ClassRoomModelEnum.STUDENT_MODEL;
      }
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        console.log(this.currentModel, "send message");
        this.emitSo(
          `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.MODEL_CHANGE}", "params": {"model": "${this.currentModel}"}}`
        );
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
      if (!this.currentItemData.items[0]) {
        console.log(this.currentItemData);
        return;
      }
      const list = getCurrentPageAnswerList(
        this.currentItemData.page_id,
        this.currentItemData.items[0].type
      );
      this.responseContentList = list;
      console.log(list);
      this.currentAnswerCount = list.length;
      let count = 0;
      let id = "-1";
      for (let i = 0; i < list.length; i++) {
        if (id != list[i].user_id) {
          count++;
          id = list[i].user_id;
        }
      }
      this.currentResponseCount = count;

      if (this.studentCounts < count) {
        this.studentCounts = count;
      }
      if (count == 0) {
        this.responsePercentage[this.currentIndex] = 0;
      } else {
        this.responsePercentage[this.currentIndex] =
          (count * 100) / this.studentCounts;
      }
    },
    getAllSlides() {
      showLoading();
      getAllPPTS(this.slide_id).then(list => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        for (let i = 0; i < list.length; i++) {
          this.responsePercentage[i] = 0;
        }
        this.getItemData();
        this.isFocus[this.currentIndex] = true;
        hideLoading();
      });
    },
    getItemData() {
      // this.options = [];
      this.$nextTick(() => {
        console.log(this.currentIndex);
        this.currentItemData = this.slides[this.currentIndex];
        this.currentItemData.flag = true;
        this.getResponeCount();
      });
    },
    copyUrl() {
      let url = location.href;
      url = url.substring(0, url.indexOf("&"));
      console.log(url);
      copy(`${url.replace(/teacher/, "students")}&page=${this.currentIndex}`);
      showToast("copy link success" + url);
    },
    giveFocus(index, notSend) {
      this.currentIndex = index;
      this.getItemData();
      if (!notSend && this.currentModel != ClassRoomModelEnum.STUDENT_MODEL) {
        this.emitSo(
          `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
        );
      }

      for (let i = 0; i < this.slides.length; i++) {
        this.isFocus[i] = i == index;
      }
      this.$forceUpdate();
    },
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.token, this.msgListener);
      let teacher = new Object();
      teacher.name = this.name ? this.name : "A teacher";
      teacher.state = "online";
      teacher.user_id = this.uid;
      this.teacherList.push(teacher);
    },
    msgListener(d = {}) {
      // answer: "Lily"
      // item_id: "item_1"
      // page_id: "page_1"
      // room: "1KxKT-_j8Z1L4ag4waifI9hnDRm0C9yNnFt7VKwVVqCg"
      // user_id: "slidec3dcef92c1cf458c"
      console.log(d);
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
      } else if (d.type === SocketEventsEnum.RENAME) {
        // 改名
        const { user_id, user_name_new, student_count } = d;
        saveStundentUidAndName(user_id, user_name_new);
      } else if (d.type === SocketEventsEnum.GO_PAGE) {
        if (d.room == this.slide_id) {
          if (d.params) {
            this.giveFocus(parseInt(d.params.page), true);
          }
        }
      } else if (d.type == SocketEventsEnum.MODEL_CHANGE) {
        this.currentModel = d.params.model;
        this.$forceUpdate();
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
    showres() {
      this.showResponse = true;
    },
    //显示当前的学生
    showStudents() {
      this.dialogTableVisible = true;
    },
    hideRes() {
      this.showResponse = false;
    }
  }
};
</script>