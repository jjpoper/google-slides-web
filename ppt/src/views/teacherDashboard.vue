<template>
  <div class="page">
    <div class="content">
      <div class="left">
        <div v-for="(item, index) in ppts" :key="index" class="pptContent">
          <div
            v-bind:class="isFocus[index]?'image_parent image_parent_focus' :'image_parent '"
            @click="giveFocus(index)"
          >
            <img :src="item.thumbnail_url" />
          </div>

          <div class="response_flag"></div>
          <div class="top" :style="'width:'+responsePercentage[index]+'%'"></div>
        </div>
      </div>
      <!-- v-if="currentItemData && currentItemData.items[0]"
          :data="currentItemData"
          :type="currentItemData.items[0].type"
      :currentAnswerCount="currentAnswerCount"-->
      <div class="divider"></div>
      <div class="response_content">
        <teacherIndexItem />
      </div>
    </div>
    <div class="number_info">Class Roster {{ current }}/{{ totalNumber }}</div>
  </div>
</template>

<!--
  1 链接socket,准备接收用户的回应
  2 获取当前所有ppt
  3 获取选中页面的学生回应（默认第一张ppt被选中）
  4

-->

<style scoped>
.page {
  position: absolute;
  width: 100%;
  height: auto;
  min-height: 100%;
}
.content {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.left {
  display: flex;
  width: 250px;
  height: auto;
  flex-direction: column;
  background-color: #efefef;
  overflow: hidden;
}
.divider {
  width: 1px;
  height: auto;
  background-color: #909090;
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

.pptContent {
  display: flex;
  flex-direction: column;
  padding: 10px;
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
  margin-top: -7px;
  margin-left: 1px;
  margin-right: 1px;
  height: 6px;
}
.response_content {
  position: fixed;
  display: flex;
  height: 100%;
  width: 100%;
  margin-left: 251px;
}
/* 

.response {
  display: flex;
  width: 100%;
  height: 100%;
} */
</style>


<script>
import { getAllPPTS } from "../model/index";
import teacherIndexItem from "../components/teacher/Index";
import { showLoading, hideLoading, showToast } from "../utils/loading";
import { createSo } from "../socket/socket.teacher";
import {
  getTeacherUid,
  saveStundentUidAndName,
  saveStudentsPageAnswerList,
  getCurrentPageAnswerList
} from "@/model/store.teacher";
export default {
  data() {
    return {
      current: 2,
      totalNumber: 4,
      ppts: [],
      slide_id: "",
      responsePercentage: [],
      isFocus: [],
      currentSo:null,
      // currentItemData: [],
      // currentAnswerCount: 0
    };
  },
  components: {
    teacherIndexItem
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.slide_id = to.query.slide_id;
      vm.getAllSlides();
    });
  },
  mounted() {
    this.joinRoom();
    // EventBus.$on(ModalEventsNameEnum.TEACHER_SEND_COMMENT, data => {
    //   this.sendComment(data);
    // });
  },
  computed: {
    currentPageId() {
      return this.slides[this.currentIndex].page_id;
    }
  },
  methods: {
    joinRoom() {
      this.currentSo = createSo(this.slide_id, this.uid, this.msgListener);
    },
    getAllSlides() {
      getAllPPTS(this.slide_id).then(list => {
        // this.contentUrl = d;
        // hideLoading()
        this.ppts = list;
        for (let i = 0; i < list.length; i++) {
          this.responsePercentage[i] = 0;
        }
        isFocus[0] = true;
        this.getItemData();
      });
    },
    giveFocus(index) {
      for (let i = 0; i < this.ppts.length; i++) {
        this.isFocus[i] = i == index;
      }
      this.$forceUpdate();
    },
    getItemData() {
      // this.options = [];
      this.$nextTick(() => {
        this.currentItemData = this.slides[this.currentIndex];
        this.getResponeCount();
      });
    },
    getResponeCount() {
      const list = getCurrentPageAnswerList(
        this.currentItemData.page_id,
        this.currentItemData.items[0].type
      );
      console.log(list);
      this.currentAnswerCount = list.length;
    }
  }
};
</script>
