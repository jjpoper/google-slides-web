<template>
  <div class="parent" v-if="avList && avList.length > 0">
    <div v-for="(item, index) in avList" :key="index">
      <div v-if="shouldShow(item)" :class="item.star ? 'parent_1 star_bg' : 'parent_1'">
        <div class="text_area">
          <div class="text_content">
            <audio
              v-if="data.items[0].type=='audio'"
              controlslist="nodownload"
              controls
              :src="item.content"
              style="width:100%;"
            />
          </div>

          <div
            class="text_static"
            v-if="flag_1 && avList.length > 1"
          >{{ index + 1 + " of " + avList.length }}</div>
        </div>
        <student-response-opt-bar
          v-if="flag_1"
          :data="{
            pageId: data.page_id,
            itemId: item.item_id,
            studentId: item.user_id,
            title: item.content,
            isStar: item.star,
            isShowRes: item.show,
            name: item.user_name,
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: flex;
  width: 90%;
  flex-wrap: wrap;
}
/* 有星标时的bg */
.star_bg {
  border: 3px solid #f7d567;
  background-color: #f8f1d3;
}
.parent_1 {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 350px;
  flex-wrap: wrap;
  height: 250px;
  border-radius: 8px;
  margin-right: 20px;
  border: 1px solid #cfcfcf;
}
.text_content {
  width: 100%;
  height: 85%;
  display: flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
}
.text_static {
  width: 100%;
  height: 15%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.text_area {
  width: 80%;
  height: 70%;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  margin-left: 20px;
  margin-right: 20px;
  background-color: white;
  color: cadetblue;
  display: flex;
  flex-direction: column;
  padding-right: 10px;
}
</style>

<script>
import { getStundentUidAndName } from "@/model/store.teacher";
import { getCurrentPageAnswerList } from "@/model/store.teacher";
import StudentResponseOptBar from "./studentResponseOptBar.vue";
export default {
  components: { StudentResponseOptBar },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      }
    },
    flag_1: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      avList: []
    };
  },
  mounted() {
    //  this.textList = getCurrentPageAnswerList(page_id, items[0].type);
    this.avList = getCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    EventBus.$on(this.data.items[0].type, data => {
      // 通知展示当前pageid，当前itemid的评论框
      console.log(this.data.items[0].type, "avlist");
      this.avList = getCurrentPageAnswerList(
        this.data.page_id,
        this.data.items[0].type
      );
    });
  },
  methods: {
    getUname(id) {
      console.log(getStundentUidAndName(id));
      const name = getStundentUidAndName(id);
      return name ? name : id;
    },
    //返回当前这个item是否应该show出来
    shouldShow(item) {
      if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      if (!item.show) return false; //如果要求隐藏，则一定需要隐藏
      if (item.star) return true; //如果是星标答案，则需要显示
      for (let i = 0; i < this.avList.length; i++) {
        if (this.avList[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
      return true;
    }
  }
};
</script>