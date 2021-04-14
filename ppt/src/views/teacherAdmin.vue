<template>
  <el-container>
    <el-main v-show="!showResponse">
      <div class="block" v-if="currentItemData && currentItemData.thumbnail_url">
        <pptcontent :url="currentItemData.thumbnail_url" :teacher="true" />
        <el-pagination
          style="line-height: 50px"
          background
          small
          layout="prev, pager, next"
          @current-change="pageChange"
          :current-page="0"
          :page-count="slides.length"
        ></el-pagination>
        <el-button type="primary" class="counts">当前人数：{{studentCounts}}</el-button>
        <el-button type="primary" class="invite" @click="openShare">Share</el-button>
        <el-button type="primary" class="Presenting">Presenting</el-button>
        <el-button type="primary" class="Show" @click="showres">Show Responses</el-button>
        <el-button
          type="primary"
          class="noShow gray"
        >{{ currentAnswerCount > 0 ? `${currentAnswerCount} Responses` : `no Responses`}}</el-button>
      </div>
    </el-main>
    <el-main v-if="showResponse">
      <el-button type="primary" @click="hideRes">hide Responses</el-button>
      <!-- <template v-if="options&&options.length > 0">
        <teacherItem
          v-if="answerList.length > 0"
          :options="options"
          :title="title"
          :answerList="answerList"
          :pageId="currentPageId"
        />
      </template>
      <template v-else-if="textList.length>0">
        <teacherTextItem  :textList="textList" />
      </template> -->
      <teacherIndexItem
        v-if="currentItemData && currentItemData.items[0]"
        :data="currentItemData"
        :type="currentItemData.items[0].type"
        :currentAnswerCount="currentAnswerCount"
      />
    </el-main>
  </el-container>
</template>
<style scoped>
.block {
  position: relative;
}
.invite {
  position: absolute;
  right: 10px;
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
.Show {
  position: absolute;
  right: 100px;
  bottom: 20px;
}
.noShow {
  position: absolute;
  right: 300px;
  bottom: 20px;
}
.Presenting {
  position: absolute;
  left: 100px;
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
</style>
<script>
import { MessageBox } from "element-ui";
import copy from "copy-to-clipboard";
import pptcontent from "../components/pptcontent";
import { getAllPPTS } from "../model/index";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import teacherIndexItem from "../components/teacher/Index";
import { createSo } from "../socket/socket.teacher";
import { SocketEventsEnum } from "../socket/socketEvents";
import {
  getTeacherUid,
  saveStundentUidAndName,
  saveStudentsPageAnswerList,
  getCurrentPageAnswerList
} from '@/model/store.teacher'

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
      currentAnswerCount: 0
    };
  },
  mounted() {
    this.joinRoom();
    this.openShare();
  },
  computed: {
    currentPageId() {
      return this.slides[this.currentIndex].page_id;
    },
  },
  components: {
    pptcontent,
    teacherIndexItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id;
      vm.getAllSlides();
    });
  },
  methods: {
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
      const list = getCurrentPageAnswerList(this.currentItemData.page_id)
      console.log(list)
      this.currentAnswerCount = list.length

    },
    getAllSlides() {
      showLoading();
      getAllPPTS(this.slide_id).then(list => {
        console.log(list);
        // this.contentUrl = d;
        // hideLoading()
        this.slides = list;
        this.getItemData();
        hideLoading();
      });
    },
    getItemData() {
      // this.options = [];
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentIndex];
        this.getResponeCount()
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
        `${location.href.replace(/teacher/, "students")}&page=${this.currentIndex}`
      );
      showToast("copy link success");
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
        console.log(d.student_count, 'd.student_count')
        this.studentCounts = d.student_count;
      } else if (d.type === SocketEventsEnum.RENAME) {
        // 改名
        const { user_id, user_name_new } = d;
        saveStundentUidAndName(user_id, user_name_new);
        // this.user_name = user_name_new;
        // for (let i = 0; i < this.textList.length; i++) {
        //   if (user_id === this.textList[i].user_id) {
        //     let newVaule = this.textList[i];
        //     newVaule.user_name = user_name_new;
        //     //   Vue.set(this.textList, i, newValue);
        //   }
        // }
      }

      // 回答问题
      const { room, page_id } = d;
      // 过滤非当前页面数据
      if(room != this.slide_id || page_id !== this.currentPageId) return
      // 回答choice
      if (d.type === SocketEventsEnum.ANSWER_QUESTION) {
        const { answer, user_id} = d;
        saveStudentsPageAnswerList(this.currentPageId, {user_id, answer})
      } else if (d.type == SocketEventsEnum.TEXT_INPUT || d.type === SocketEventsEnum.NUMBER_INPUT) {
        //接收到text input或者number input的值
        const {
          content,
          user_id,
          user_name,
          item_id
        } = d;
        
        // let textList = this.textList;
        // if (!textList || textList.length == 0) {
        //   textList.push({
        //     content,
        //     user_id,
        //     user_name,
        //     item_id
        //   });
        // } else {
        //   let found = false;
        //   for (let i = 0; i < textList.length; i++) {
        //     if (
        //       textList[i].user_id === user_id &&
        //       textList[i].item_id === item_id
        //     ) {
        //       found = true;
        //       textList[i].content = content;
        //       textList[i].user_name = user_name;
        //     }
        //   }
        //   if (!found) {
        //     textList.push({
        //       content,
        //       user_id,
        //       user_name,
        //       item_id
        //     });
        //   }
        // }
        // this.user_name = user_name;
        // this.textList = textList;
        // saveTeacherDatalist(
        //   currentPageId,
        //   textList,
        //   d.type
        // );

        saveStudentsPageAnswerList(this.currentPageId, {user_id, content, user_name, item_id})
      }

      this.getResponeCount()
    },
    // '{"type":"change_page", "params": {"page": 3}}'
    emitSo(message) {
      if (this.currentSo) {
        // this.currentSo.emit('control', JSON.stringify(data));
        this.currentSo.emit("control", message);
      }
    },
    openShare() {
      const url = `${location.href.replace(/teacher/, "students")}&page=${
        this.current
      }`;
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
      this.showResponse = true;
    },
    hideRes() {
      this.showResponse = false;
    }
  }
};
</script>