<template>
  <div class="page">
    <div class="left">
      <div v-for="(item, index) in slides" :key="index" class="ppt_content">
        <div
          v-bind:class="
            isFocus[index] ? 'image_parent image_parent_focus' : 'image_parent '
          "
          @click="giveFocus(index)"
        >
          <img :src="item.thumbnail_url" />
        </div>

        <div class="response_flag">
          <div
            class="top"
            :style="'width:' + responsePercentage[index] + '%'"
          ></div>
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
          :textList = responseContentList
        />
      </div>
    </div>
    <div class="number_info">
      Class Roster {{ currentResponseCount }}/{{ studentCounts }}
    </div>

    <commentModal />
  </div>
</template>
<style scoped>
.page {
  width: 100%;
  height: 100%;
  display: flex;
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
</style>
<script>
import { MessageBox } from "element-ui";
import copy from "copy-to-clipboard";
import pptcontent from "../components/pptcontent";
import { getAllPPTS } from "../model/index";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import teacherIndexItem from "../components/teacher/Index";
import { createSo } from "../socket/socket.teacher";
import { ModalEventsNameEnum, SocketEventsEnum } from "../socket/socketEvents";
import {
  getTeacherUid,
  saveStundentUidAndName,
  saveStudentsPageAnswerList,
  getCurrentPageAnswerList,
} from "@/model/store.teacher";
import commentModal from "../components/teacher/commentModal";

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
      responseContentList:[],
    };
  },
  mounted() {
    this.joinRoom();
    //   this.openShare();
    EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, (data) => {
      console.log("send comment!!");
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
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.slide_id = to.query.slide_id;
      vm.getAllSlides();
    });
  },
  methods: {
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
      const list = getCurrentPageAnswerList(
        this.currentItemData.page_id,
        this.currentItemData.items[0].type
      );
      this.responseContentList= list
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
      getAllPPTS(this.slide_id).then((list) => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        for (let i = 0; i < list.length; i++) {
          this.responsePercentage[i] = 0;
        }
        this.getItemData();
        this.isFocus[0] = true;
        hideLoading();
      });
    },
    getItemData() {
      // this.options = [];
      this.$nextTick(() => {
        console.log(this.currentIndex)
        this.currentItemData = this.slides[this.currentIndex];
        this.currentItemData.flag = true;
        this.getResponeCount();
      });
    },
    pageChange(value) {
      this.currentIndex = value - 1;
      this.getItemData();
      // 换页命令
      // '{"type":"change_page", "params": {"page": 3}}'
      this.emitSo(
        `{"room":"${this.slide_id}", "type": "${SocketEventsEnum.GO_PAGE}", "params": {"page": "${this.currentIndex}"}}`
      );
    },
    copyUrl() {
      copy(
        `${location.href.replace(/teacher/, "students")}&page=${
          this.currentIndex
        }`
      );
      showToast("copy link success");
    },
    giveFocus(index) {
      this.currentIndex = index;
      this.getItemData();
      console.log(index)
      for (let i = 0; i < this.slides.length; i++) {
        this.isFocus[i] = i == index;
      }
      this.$forceUpdate();
    },
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.uid, this.msgListener);
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
      } else if (d.type === SocketEventsEnum.RENAME) {
        // 改名
        const { user_id, user_name_new, student_count } = d;
        saveStundentUidAndName(user_id, user_name_new);
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
    hideRes() {
      this.showResponse = false;
    },
  },
};
</script>