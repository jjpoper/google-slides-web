<template>
  <el-container>
    <el-main>
      <div class="block" v-if="currentItemData && currentItemData.thumbnail_url">
        <pptcontent :url="currentItemData.thumbnail_url" :teacher="true" />
      </div>

      <div class="sfooter" v-if="slides.length > 0">
        <div>
          {{uname}}
          <el-button type="primary" @click="enterUname(false)">改名</el-button>
        </div>
        <div class="checkboxs">
          <el-checkbox
            :value="currentAnswerd"
          >slide {{parseInt(currentIndex)+1}}/{{slides.length}}</el-checkbox>
          <div class="scroll-mask"></div>
        </div>
      </div>
    </el-main>
    <el-aside width="50%">
      <StudentsIndexItem
        v-if="currentItemData && currentItemData.items[0]"
        :data="currentItemData"
        :type="currentItemData.items[0].type"
        :method="answerText"
        :answer="answerChoice"
      />
      <!-- <studentsItem
        v-if="options && options.length > 0"
        :options="options"
        :title="title"
        :answer="answer"
        :pageId="currentPageId"
      />
      <textItem v-else-if="type=='text'" :method="sendText" :pageId="currentPageId" />

      <numberItem v-else-if="type=='number'" :method="sendText" :pageId="currentPageId" />
      <div v-else-if="type=='website'" style="width: 100%; height: 100%">
        <iframe class="website" :src="`https://${currentData.url}`"/>
      </div> -->
    </el-aside>
    <!--   options.length > 0 <el-aside width="400px" class="scroll-student">
      <template v-for="(slideItem, index) in slides">
        <studentsItem
          v-if="slideItem.items.data"
          :key="index"
          :options="slideItem.items.data.options"
          :title="slideItem.items.data.title"
          :currentAnswer="allAnswers[slideItem.page_id]"
          :readonly="true"
          :pageId="slideItem.page_id">
          <div class="scroll-mask"></div>
        </studentsItem>
      </template>
    </el-aside>-->
  </el-container>
</template>
<style>
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.checkboxs {
  position: relative;
  flex: 1;
}
.website{
  width: 90%;
  height: 100%;
}
</style>
<script>
import pptcontent from "../components/pptcontent";
import { getAllPPTS } from "../model/index";
import { showLoading, hideLoading } from "../utils/loading";
import StudentsIndexItem from "../components/students/Index";
import { createSo } from "../socket/socket.student";
import { SocketEventsEnum } from "../socket/socketEvents";
import {
  getStudentUid,
  saveStudentsCurrentPageAnswerList,
  getStudentCurrentPageAnswerList,
  getStudentUserName,
  saveStudentUserName
} from '@/model/store.student'
import { MessageBox } from "element-ui";

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
      uid: getStudentUid() // uid
    };
  },
  mounted() {
    this.beforejoinRoom();
  },
  components: {
    pptcontent,
    StudentsIndexItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id;
      vm.currentIndex = to.query.page || 0;
      vm.getAllSlides();
    });
  },
  methods: {
    checkCurrentAnswerd(){
      const {page_id} = this.currentItemData
      const list = getStudentCurrentPageAnswerList(page_id);
      console.log('list', list);
      this.currentAnswerd = list.length > 0;
    },
    getAllSlides() {
      showLoading();
      getAllPPTS(this.slide_id).then(list => {
        console.log(list);
        this.slides = list;
        this.getItemData();
        hideLoading();
      });
    },
    //发送text
    answerText(index, msg) {
      console.log("index==" + index + "  msg==" + msg);
      const {page_id, items} = this.currentItemData;
      const {type} = items[0]
      this.emitSo(
        "response",
        `{"room": "${this.slide_id}", "type":"${type}", "user_id": "${this.uid}", "user_name":"${this.uname}", "page_id": "${page_id}", "item_id": "${index}", "content":"${msg}"}`
      );
      saveStudentsCurrentPageAnswerList(page_id, {
        item_id: index,
        key: index,
        content: msg
      })
      this.currentAnswerd = true
    },
    getItemData() {
      this.$nextTick(() => {
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
      this.currentIndex = page;
      this.getItemData();
    },
    beforejoinRoom() {
      const uname = getStudentUserName(this.uid);
      console.log(uname, "uname");
      this.uname = uname != "null" && uname != undefined ? uname : "";
      if (!this.uname) {
        this.enterUname(true);
      } else {
        this.joinRoom();
      }
    },
    joinRoom() {
      this.currentSo = createSo(
        this.slide_id,
        this.uid,
        this.uname,
        this.msgListener,
        () => {
          this.emitSo(
            "rename",
            `{"room": "${this.slide_id}", "user_id": "${this.uid}", "user_name_new": "${this.uname}"}`
          );
        }
      );
    },
    msgListener(d) {
      console.log(d, d.type, "====收到页码命令");
      // 收到切换页码命令
      if (d.type === SocketEventsEnum.GO_PAGE) {
        this.pageChange(d.params.page);
      }
    },
    answerChoice(v) {
      console.log("change answer==" + v, this.currentSo);
      const {page_id} = this.currentItemData;
      // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
      this.emitSo(
        "response",
        `{"room": "${this.slide_id}", "user_id": "${this.uid}", "page_id": "${page_id}", "item_id": "item_1", "answer": "${v}"}`
      );
      saveStudentsCurrentPageAnswerList(page_id, {
        key: 'item_1',
        answer: v
      })
      this.currentAnswerd = true
      // // this.allAnswers[pid] = v;
      // this.$set(this.allAnswers, pid, v);
      // // this.$forceUpdate()
      // console.log(this.allAnswers, "====", this.allAnswers[this.currentPageId]);
    },
    emitSo(action, message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        console.log(action);
        this.currentSo.emit(action, message);
      }
    },
    enterUname(status) {
      MessageBox.prompt("enter a new name", "enter a new name", {
        confirmButtonText: "确定",
        showCancelButton: false,
        showClose: false
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
              `{"room": "${this.slide_id}", "user_id": "${this.uid}", "user_name_new": "${value}"}`
            );
          }
        })
        .catch(() => {});
    }
  }
};
</script>