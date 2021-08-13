<template>
  <div class="text-answer-container" v-if="textList && textList.length > 0">
    <div class="text-answer-tab">123
    </div>
    <div class="text-answer-list">
      <div class="colume5" v-for="(item, index) in textList" :key="index">
        <div class="text-item-outer5">
          <div
            v-if="shouldShow(item)"
            :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
          >
            <div class="text_area">
              {{ getText(item) }}
              <span class="text_static" v-if="flag_1 && textList.length > 1">
                {{ index + 1 + " of " + textList.length }}
              </span>
            </div>
            <div class="text-footer">
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
                  answertime: item.updated_at
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="item in noAnswerStudents" :key="item.user_id">
      {{item.user_id}}</div>
  </div>
</template>

<script>
import { getStundentUidAndName } from "@/model/store.teacher";
import { getCurrentPageAnswerList } from "@/model/store.teacher";
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapState } from 'vuex'
export default {
  computed: {
    // 未答题学生
    noAnswerStudents() {
      let noList = []
      for(let i = 0; i < this.studentList.length; i++) {
        const currentUser = this.studentList[i]
        const index = this.textList.findIndex(item => item.user_id === currentUser.user_id)
        if(index !== -1) {
          noList.push(currentUser)
        }
      }
      console.log(noList)
      return noList
    },
    ...mapState({
      studentList: state => state.teacher.studentList
    })
  },
  components: { StudentResponseOptBar },
  props: {
    data: {
      type: Object,
      default: () => {
        return {};
      },
    },
    flag_1: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      textList: [],
      isTextChanging: false,
      changeUser: "", //当前是哪个item发生了变化
      changeItemId: "", //当前是哪个item发生了变化
    };
  },
  mounted() {
    //  this.textList = getCurrentPageAnswerList(page_id, items[0].type);
    this.textList = getCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    EventBus.$on(this.data.items[0].type, (data) => {
      // 通知展示当前pageid，当前itemid的评论框
      console.log(data);
      this.textList = getCurrentPageAnswerList(
        this.data.page_id,
        this.data.items[0].type
      );
      this.isTextChanging = true;
      this.changeUser = data.user_id;
      this.changeItemId = data.item_id;
      let _this = this;
      setTimeout(function () {
        _this.isTextChanging = false;
      }, 3000);
    });
    console.log(this.studentList, this.textList, '===studentList')
  },
  methods: {
    getUname(id) {
      console.log(getStundentUidAndName(id));
      const name = getStundentUidAndName(id);
      return name ? name : id;
    },
    getText(item) {
      if (item.content) {
        if (this.isTextChanging) {
          if (
            item.user_id == this.changeUser &&
            item.item_id == this.changeItemId
          ) {
            return item.content + "....";
          }
        }
        return item.content;
      }
      return "Deleted response";
    },
    //返回当前这个item是否应该show出来
    shouldShow(item) {
      if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      if (!item.show) return false; //如果要求隐藏，则一定需要隐藏
      if (item.star) return true; //如果是星标答案，则需要显示
      for (let i = 0; i < this.textList.length; i++) {
        if (this.textList[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
      return true;
    },
  },
};
</script>


<style scoped>
.text-answer-container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
}
.text-answer-tab{
  width: 100%;
  height: 40px;
}
.text-answer-list{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  flex: 1;
  overflow: scroll;
}
.colume5{
  /* -webkit-column-count:  5;
  -moz-column-count:  5;
  column-count:  5;
  -webkit-column-gap:  5px;
  -moz-column-gap:  5px;
  column-gap:  5px; */
  width: 20%;
  padding: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
.colume1{
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;
}
/* 有星标时的bg */
.star_bg {
  border: 3px solid #f7d567;
  background-color: #f8f1d3;
}
.text-item-outer1{
  height: 290px;
  width: 100%;
  position: relative;
}
.text-item-outer5{
  width: 100%;
  padding-bottom: 85%;
  position: relative;
}
.text-list-item {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  margin-right: 10px;
  border: 1px solid #F1F1F1;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}
.text_static {
  position: absolute;
  bottom: 10px;
  right: 7px;
}
.text_area {
  width: 100%;
  height: 59%;
  background: #E4E4E4;
  opacity: 0.3;
  border-radius: 6px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  box-sizing: border-box;
  padding:7px 7px 30px 7px;
  overflow: scroll;
  position: relative;
  text-align: left;
}
.text-footer{
  width: 100%;
  height: 41%;
}
</style>