<template>
  <div class="text-answer-container" >
    <common-switch-tab :currentTab="currentTab" :changeTab="changeTab"/>
    <template v-if="selectedAnswerList && selectedAnswerList.length > 0">
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
                       style="height: 150px"
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
                        title: item.type === 'text' ? item.link : {link: item.link, mediaType: item.type},
                        isStar: item.star,
                        isShowRes: item.show,
                        name: item.user_name,
                        answertime: item.updated_at,
                        id: item.id
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </template>
    <template v-else>
      <loading-view />
    </template>
  </div>
</template>

<script>
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapGetters, mapState } from 'vuex'
import StudentQuestions from '../students/studentQuestions.vue';
import StudentRemark from '../students/studentRemark.vue';
import AudioPlayer from '../common/audioPlayer.vue';
import CommonSwitchTab from './commonSwitchTab.vue';
import LoadingView from './loadingView.vue';
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
    }),
    ...mapGetters({
      selectedGroupMembers: 'student/selectedGroupMembers'
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
  components: { StudentResponseOptBar, StudentQuestions, StudentRemark, AudioPlayer, CommonSwitchTab, LoadingView},
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
      if (this.flag_1) return true; //如果是dashboard 模式，则一定show
      if (item.show_response == 1) return false; //如果要求隐藏，则一定需要隐藏
      if (item.star) return true; //如果是星标答案，则需要显示
      for (let i = 0; i < this.selectedAnswerList.length; i++) {
        if (this.selectedAnswerList[i].star) return false; //如果不是星标答案，且有其他的星标答案，则需要隐藏
      }
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
</style>