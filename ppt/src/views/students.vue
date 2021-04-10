<template>
  <el-container>
    <el-main>
      <div class="block" v-if="pptUrl">
        <pptcontent :url="pptUrl" />
      </div>

      <div class="sfooter" v-if="slides.length > 0">
        <div>
          {{uname}}
          <el-button type="primary" @click="enterUname(false)">改名</el-button>
        </div>
        <div class="checkboxs">
          <el-checkbox
            :value="currentAnswerd||currentInputed"
          >slide {{parseInt(current)+1}}/{{slides.length}}</el-checkbox>
          <div class="scroll-mask"></div>
        </div>
      </div>
    </el-main>
    <el-aside width="50%">
      <studentsItem
        v-if="options && options.length > 0"
        :options="options"
        :title="title"
        :answer="answer"
        :pageId="getPid"
      />
      <textItem v-else-if="type=='text'" :method="sendText" :pageId="getPid" />

      <numberItem v-else-if="type=='number'" :method="sendText" :pageId="getPid" />
      <div v-else-if="type=='website'" style="width: 100%; height: 100%">
        <iframe class="website" :src="`https://${currentData.url}`"/>
      </div>
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
import studentsItem from "../components/studentsItem";
import textItem from "../components/students/textItem";
import numberItem from "../components/students/numberIndex";
import { createSo } from "../socket/socket.student";
import { SocketEventsEnum } from "../socket/socketEvents";
import {
  getStudentUid,
  getUserName,
  setStudentUid,
  setUserName
} from "../utils/user";
import { generateUuid } from "@/utils/help";
import {
  getStudentsAnswer,
  getStudentsDataList,
  saveStudentsDataList
} from "@/utils/store";
import { MessageBox } from "element-ui";

export default {
  data() {
    return {
      pptUrl: null,
      title: "",
      options: [],
      slides: [],
      current: 0,
      slide_id: 0,
      currentSo: null,
      allAnswers: {},
      uname: "",
      type: "",
      numberSended: false,
      textSended: false,
      currentData: null,
      uid: getStudentUid() // uid
    };
  },
  mounted() {
    if (this.uid === null || this.uid === undefined) {
      this.uid = generateUuid("s_", 16);
      setStudentUid(this.uid);
      this.beforejoinRoom();
    } else {
      this.beforejoinRoom();
    }
  },
  computed: {
    getPid() {
      return this.slides[this.current].page_id;
    },
    currentAnswerd() {
      const ans = this.allAnswers[this.getPid];
      console.log(parseInt(ans) >= 0, "choice 选择结果", ans);
      return parseInt(ans) >= 0;
    },
    currentInputed(){
      if(this.textSended||this.numberSended)return true
      const arr = getStudentsDataList(this.getPid,this.type)
      console.log(arr&&arr.length>0)
      return  arr&&arr.length>0
    }
  },
  components: {
    pptcontent,
    studentsItem,
    textItem,
    numberItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id;
      vm.current = to.query.page || 0;
      vm.getAllSlides();
    });
  },
  methods: {
    getAllSlides() {
      showLoading();
      getAllPPTS(this.slide_id).then(list => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        this.getCurrentPPT();
        this.getItemData();
        this.getAllAnswers();
        hideLoading();
      });
    },
    //发送text
    sendText(index, msg) {
      console.log("index==" + index + "  msg==" + msg);
      const pid = this.slides[this.current].page_id;
      if (this.type == SocketEventsEnum.TEXT_INPUT) {
        this.textSended = true;
      } else if (this.type == SocketEventsEnum.NUMBER_INPUT) {
        this.numberSended = true;
      }
      // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
      this.emitSo(
        "response",
        `{"room": "${this.slide_id}", "type":"${this.type}","user_id": "${this.uid}","user_name":"${this.uname}","page_id": "${pid}", "item_id": "${index}", "content":"${msg}"}`
      );
    },
    getAllAnswers() {
      for (let i = 0; i < this.slides.length; i++) {
        const choice = this.slides[this.current].items[0];
        if (choice && choice.data) {
          const pid = this.slides[i].page_id;
          const value = getStudentsAnswer(pid);
          this.$set(this.allAnswers, pid, value);
          // console.log(getStudentsAnswer(pid))
        }
      }
      console.log(this.allAnswers[this.getPid], "===", this.allAnswers);
    },
    getItemData() {
      this.options = [];
      this.textSended = false
      this.numberSended = false
      this.type = null
      this.$nextTick(() => {
        const choice = this.slides[this.current].items[0];
        if (choice && choice.data) {
          this.type = choice.type;
          console.log("currentType==" + this.type);
          this.currentData = choice.data
          const { title, options } = choice.data;
          this.title = title;
          this.options = options;
        }
      });
    },
    getCurrentPPT() {
      this.pptUrl = this.slides[this.current].thumbnail_url;
    },
    pageChange(page) {
      this.current = page;
      this.getCurrentPPT();
      this.options = [];
      this.getItemData();
    },
    beforejoinRoom() {
      const uname = getUserName(this.uid);
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
    answer(v) {
      console.log("change answer==" + v, this.currentSo);
      const pid = this.slides[this.current].page_id;
      // emit('response', `{"room": "${room}", "user_id": "student_1", "page_id": "page_1", "item_id": "item_1", "answer": "Lily"}`
      this.emitSo(
        "response",
        `{"room": "${this.slide_id}", "user_id": "${this.uid}", "page_id": "${pid}", "item_id": "item_1", "answer": "${v}"}`
      );

      // this.allAnswers[pid] = v;
      this.$set(this.allAnswers, pid, v);
      // this.$forceUpdate()
      console.log(this.allAnswers, "====", this.allAnswers[this.getPid]);
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
          setUserName(this.uid, value);
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