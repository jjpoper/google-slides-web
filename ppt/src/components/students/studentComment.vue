<template>
  <div class="studentComment" v-if="modalVisibale">
    <div>
      <div class="title">Teacher Feedback</div>
      <div v-for="(item, index) in commentList" :key="index.toString()">
        <p class="title">slide {{item.slideIndex}}</p>
        <div class="rightmtitle" v-if="item.title.indexOf('data:image/') > -1">
          <base64image :url="item.title" />
        </div>
        <div class="rightmtitle" v-else-if="item.title.indexOf('[') > -1">
          <p v-for="(text,index) in JSON.parse(item.title)" :key="index">{{text}}</p>
        </div>
        <div class="rightmtitle" v-else>{{item.title}}</div>
        <div class="rightcomment">
          <div class="section">
            <p>{{item.teacherName}}</p>
            <p>{{item.time}}</p>
            <p>{{item.value}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.studentComment {
  position: absolute;
  width: 80%;
  height: 100%;
  overflow-y: scroll;
  top: 0;
  right: 0;
  border-left: 1px solid #999;
  box-sizing: border-box;
  padding: 20px;
  background-color: #fff;
  line-height: 50px;
  text-align: left;
  z-index: 9998;
}
.title {
  height: 50px;
  text-align: center;
}
.rightmtitle {
  width: 100%;
  min-height: 70px;
  background-color: #f2f2f2;
  border: 1px solid #999;
  box-sizing: border-box;
  padding: 10px;
  word-wrap: break-word;
  line-height: 20px;
  position: relative;
}
.rightcomment {
  width: 100%;
  min-height: 70px;
  background-color: #fff;
  border: 1px solid #999;
  box-sizing: border-box;
  padding: 10px;
  word-wrap: break-word;
  line-height: 20px;
}
.section {
  margin-bottom: 10px;
}
</style>
<script>
import { ModalEventsNameEnum } from "@/socket/socketEvents";
import { getStudentCommentList } from "@/model/store.student";
import { showToast } from "@/utils/loading";
import base64image from "../base64image.vue";
export default {
  data() {
    return {
      modalVisibale: false,
      commentList: []
    };
  },
  components: { base64image },
  mounted() {
    // this.showStudentModal()
    EventBus.$on(ModalEventsNameEnum.SHOW_STUDENT_MODAL, status => {
      if (status) {
        this.showStudentModal();
      } else {
        this.hideStudentModal();
      }
    });

    EventBus.$on(ModalEventsNameEnum.SHOW_STUDENT_MODAL_REFRESH, () => {
      this.refreshList();
    });
  },
  methods: {
    showStudentModal() {
      const list = getStudentCommentList();
      // let newMap = {}
      // for(let i = 0; i < list.length; i++) {
      //   const item = list[i]
      //   const {itemId, slideIndex} = item
      //   if(newMap[itemId]) {
      //     newMap[itemId].items.push(item)
      //   } else {
      //     newMap[itemId] = {
      //       slideIndex,
      //       items: [item]
      //     }
      //   }
      // }

      this.commentList = list;
      console.log(list);
      this.modalVisibale = true;
    },
    hideStudentModal() {
      this.modalVisibale = false;
      this.commentList = [];
    },
    refreshList() {
      const list = getStudentCommentList();
      this.commentList = list;
      showToast("new messages loaded");
    }
  }
};
</script>