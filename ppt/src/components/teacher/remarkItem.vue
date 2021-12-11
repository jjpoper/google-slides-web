<template>
  <div class="text-answer-container" v-if="selectedAnswerList && selectedAnswerList.length > 0">
    <common-switch-tab :currentTab="currentTab" :changeTab="changeTab"/>
    <template v-if="currentTab !== 3">
      <div class="text-scroll">
        <div class="text-answer-list">
          <div :class="`colume${currentTab === 1 ? '1' : '5'} `" v-for="(item, index) in selectedAnswerList" :key="index">
            <div :class="`text-item-outer${currentTab === 1 ? '1' : '5'} ${!flag_1 && 'full-text-area'}`">
              <div
                v-if="shouldShow(item)"
                :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
              >
                <div :class="`text_area ${currentTab === 1 ? '' : 'columText'} ${!flag_1 && 'full-text-area'}`" >
                  <div :class="`remark-item-content1 ${item.type === 'text' && 'content-text-scroll'}`">
                    <VideoPlayer
                      v-if="item.type === 'video'"
                      controlslist="nodownload"
                      controls=""
                      :src="item.link"
                      preload="auto"
                    />
                    <audio-player v-else-if="item.type === 'audio'" :url="item.link"/>
                    <p class="textinner" v-else-if="item.type === 'text'">
                      {{item.link}}
                    </p>
                  </div>
                  <span class="text_static" v-if="flag_1 && selectedAnswerList.length > 1">
                    {{ index + 1 + " of " + selectedAnswerList.length }}
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
        <!-- <div v-if="flag_1 && noAnswerStudents.length" class="on-as-outer">
          <div class="no-as-title">
            <i></i> No Response
          </div>
          <div class="on-as-list">
            <p class="on-as-list-item" v-for="item in noAnswerStudents" :key="item.user_id">
              {{item.user_id}}
            </p>
          </div>
        </div> -->
      </div>    
    </template>
    <template v-else-if="currentTab === 3">
      <div class="teacherppt-outer" >
        <div class="fullbgimg" :style="`position: relative;background-image:url(${currentPPTUrl})`">
          <student-questions :disable="true"/>
        </div>
        <div class="teacherppt-remark">
          <student-remark :disable="true"/>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapState } from 'vuex'
import StudentQuestions from '../students/studentQuestions.vue';
import StudentRemark from '../students/studentRemark.vue';
import AudioPlayer from '../common/audioPlayer.vue';
import CommonSwitchTab from './commonSwitchTab.vue';
export default {
  computed: {
    // 未答题学生
    // noAnswerStudents() {
    //   let noList = []
    //   for(let i = 0; i < this.studentList.length; i++) {
    //     const currentUser = this.studentList[i]
    //     const index = this.marks.findIndex(item => item.user_id === currentUser.user_id)
    //     if(index === -1) {
    //       noList.push(currentUser)
    //     }
    //   }
    //   return noList
    // },
    ...mapState({
      allRemarks: state => state.remark.allRemarks,
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
      selectedGroupMembers: state => state.teacher.selectedGroupMembers,
    }),
    selectedAnswerList() {
      if(this.selectedGroupMembers.length === 0) return this.marks
      let list = this.marks.filter(item => {
        return this.selectedGroupMembers.indexOf(item.user_id) > -1
      })
      return list
    },
    marks() {
      let list = []
      if(this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      list = this.resortList(list)
      // console.log(list)
      return list;
    },
    currentPageId() {
      return this.studentAllSlides[this.currentPageIndex].page_id
    },
    currentPPTUrl() {
      return this.studentAllSlides[this.currentPageIndex].thumbnail_url
    }
  },
  components: { StudentResponseOptBar, StudentQuestions, StudentRemark, AudioPlayer, CommonSwitchTab},
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
      // console.log('init =====')
  },
  // watch: {
  //   sortValue() {
  //     this.resortList()
  //   }
  // },
  methods: {
    //返回当前这个item是否应该show出来
    shouldShow(item) {
      // if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      // if (!item.show) return false; //如果要求隐藏，则一定需要隐藏
      // if (item.star) return true; //如果是星标答案，则需要显示
      // for (let i = 0; i < this.marks.length; i++) {
      //   if (this.marks[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      // }
      return true;
    },
    changeTab(i) {
      this.currentTab = i
    },
    resortList(list) {
      let newList = JSON.parse(JSON.stringify(list))
      return newList.reverse()
      try {
        if(this.sortValue === 1) {
          newList = newList.sort((prev, next) => {
            return prev.updated_at - next.updated_at
          })
        }

        // 数字 》 英文 》中文
        if(this.sortValue === 2) {
          newList = newList.sort((prev, next)=>{
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
          newList = newList.sort((prev, next)=>{
            const precontent = prev.link
            const nextcontent = next.link
            if(precontent) {
                return -1
            } else if(!precontent && nextcontent) {
                return 1
            } else {
              return 0
            }
          })
        }
        return newList
      } catch(e) {
        // console.log(e)
        return []
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
.text-scroll{
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: scroll;
  position: relative;
  padding-bottom: 100px;
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
  /* height: 290px; */
  width: 100%;
  position: relative;
}
.text-item-outer5{
  width: 100%;
  /* padding-bottom: 85%; */
  position: relative;
}
.text-item-outer1.full-text-area{
  /* height: 148px; */
}
.text-item-outer5.full-text-area{
  padding-bottom: 45%;
}
.text-list-item {
  width: 100%;
  /* height: 100%; */
  border-radius: 8px;
  margin-right: 10px;
  border: 1px solid #F1F1F1;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.16);
  background-color: #fff;
  box-sizing: border-box;
  padding: 10px;
  /* position: absolute; */
  top: 0;
  left: 0;
  overflow: hidden;
}
.text_static {
  position: absolute;
  bottom: 0px;
  right: 7px;
}
.text_area {
  width: 100%;
  /* height: 59%; */
  background: rgba(228,228,228,0.3);
  border-radius: 6px;
  font-size: 14px;
  font-family: Inter-Bold;
  line-height: 24px;
  color: #000000;
  box-sizing: border-box;
  padding:7px 7px 20px 7px;
  overflow: scroll;
  word-break: break-all;
  position: relative;
  text-align: left;
}
.columText{
  height: 100px;
}
.textinner{
  overflow: scroll;
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
video{
  width: 100%; height: 100%; object-fit: cover
}
.remark-item-content1{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  word-break: break-all;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.remark-item-content1.content-text-scroll{
  overflow-y: scroll;
  justify-content: flex-start;
  align-items: flex-start;
}
.remark-item-content1 video{
  width: 268px;
}
.teacherppt-outer{
  width: 100%;
  height: 100%;
  position: relative;
  box-sizing: border-box;
  padding-right: 360px;
}
.teacherppt-remark{
  width: 350px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0
}
</style>