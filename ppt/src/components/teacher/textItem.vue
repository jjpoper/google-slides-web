<template>
  <div class="text-answer-container" v-if="textList && textList.length > 0">
    <div class="text-answer-tab">
      <button :class="`button-row ${currentTab === 1 && 'active'}`" @click="changeTab(1)"></button>
      <button :class="`button-colum ${currentTab === 2 && 'active'}`" @click="changeTab(2)"></button>
      <el-select v-model="sortValue" placeholder="Sort">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="text-scroll">
      <div class="text-answer-list">
        <div :class="`colume${currentTab === 1 ? '1' : '5'} `" v-for="(item, index) in textList" :key="index">
          <div :class="`text-item-outer${currentTab === 1 ? '1' : '5'} ${!flag_1 && 'full-text-area'}`">
            <div
              v-if="shouldShow(item)"
              :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
            >
              <div :class="`text_area ${!flag_1 && 'full-text-area'}`" >
                {{ getText(item) }}
                <span class="text_static" v-if="flag_1 && textList.length > 1">
                  {{ index + 1 + " of " + textList.length }}
                </span>
              </div>
              <div class="text-footer" v-if="flag_1">
                <student-response-opt-bar
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
      <div v-if="flag_1 && noAnswerStudents.length" class="on-as-outer">
        <div class="no-as-title">
          <i></i> No Response
        </div>
        <div class="on-as-list">
          <p class="on-as-list-item" v-for="item in noAnswerStudents" :key="item.user_id">
            {{item.user_id}}
          </p>
        </div>
      </div>
    </div>    
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
        if(index === -1) {
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
      currentTab: 1,
      options: [],
      sortValue: 1
    };
  },
  created() {
    this.options = this.flag_1 ? [
        {
          value: 1,
          label: 'sort by time'
        },
        {
          value: 2,
          label: 'sort by name'
        },
        {
          value: 3,
          label: 'sort by response'
        },
      ] : [
        {
          value: 1,
          label: 'sort by time'
        },
        {
          value: 3,
          label: 'sort by response'
        },
      ]
  },
  watch: {
    sortValue() {
      this.resortList()
    }
  },
  mounted() {
    //  this.textList = getCurrentPageAnswerList(page_id, items[0].type);
    const list = getCurrentPageAnswerList(
      this.data.page_id,
      this.data.items[0].type
    );
    this.textList = list
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

      this.resortList()
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
    changeTab(i) {
      this.currentTab = i
    },
    resortList() {
      const {textList} = this
      try {
        if(this.sortValue === 1) {
          this.textList = textList.sort((prev, next) => {
            return prev.updated_at - next.updated_at
          })
        }

        // 数字 》 英文 》中文
        if(this.sortValue === 2) {
          this.textList = textList.sort((prev, next)=>{
            const preName = prev.user_id
            const nextName = next.user_id
            let reg = /[a-zA-Z0-9]/
              if (reg.test(preName)|| reg.test(nextName)) {
                if (preName > nextName){
                    return 1
                } else if(preName < nextName){
                    return -1
                } else {
                    return 0
                }
              } else {
                return preName.localeCompare(nextName)
              }
          })
        }

        // 有答案 》 无答案
        if(this.sortValue === 3) {
          this.textList = textList.sort((prev, next)=>{
            const precontent = prev.content
            const nextcontent = next.content
            if(precontent) {
                return -1
            } else if(!precontent && nextcontent) {
                return 1
            } else {
              return 0
            }
          })
        }
        console.log(this.textList)
        this.$forceUpdate()
      } catch(e) {
        console.log(e)
      }
    }
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
  position: relative;
  background-color: #fff;
}
.text-answer-tab{
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
}
.text-answer-tab button{
  width: 32px;
  height: 32px;
  margin-right: 22px;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 32px 32px;
  cursor: pointer;
  border: none;
}
.button-colum{
  background-image: url(../../assets/picture/colum.png);
}
.button-colum.active{
  background-image: url(../../assets/picture/colum-s.png);
}
.button-row{
  background-image: url(../../assets/picture/row.png);
}
.button-row.active{
  background-image: url(../../assets/picture/row-s.png);
}
.text-scroll{
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: scroll;
  position: relative;
}
.text-answer-list{
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
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
.text-item-outer1.full-text-area{
  height: 148px;
}
.text-item-outer5.full-text-area{
  padding-bottom: 45%;
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
  background: rgba(228,228,228,0.3);
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
.text_area.full-text-area{
   height: 100%;
}
.text-footer{
  width: 100%;
  height: 41%;
}
.on-as-outer{
  width: 50%;
  min-height: 100px;
  background: #FFFFFF;
  border: 1px solid #F7F8FF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 6px;
  box-sizing: border-box;
  padding: 18px 14px;
  position: relative;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.no-as-title{
  height: 24px;
  font-size: 18px;
  font-family: Segoe UI;
  font-weight: bold;
  line-height: 24px;
  color: #36425A;
  padding-left: 28px;
  display: inline-block;
  text-align: left;
  position: relative;
}
.no-as-title >i{
  width: 18px;
  height: 18px;
  border-radius: 9px;
  background-color: #FF1A0E;
  display: inline-block;
  top: 3px;
  left: 0;
  position: absolute;
}
.on-as-list{
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  font-size: 18px;
  font-family: Segoe UI;
  font-weight: bold;
  line-height: 24px;
  color: #BCBCBC;
  margin-top: 17px;
}
.on-as-list-item{
  margin-right: 20px;
}
</style>