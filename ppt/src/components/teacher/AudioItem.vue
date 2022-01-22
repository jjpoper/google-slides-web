<template>
  <div class="text-answer-container" >
    <common-switch-tab :currentTab="currentTab" :changeTab="changeTab"/>
    <div class="text-scroll" v-if="selectedAnswerList && selectedAnswerList.length > 0">
      <div class="text-answer-list">
        <div :class="`colume${currentTab === 1 ? '1' : '5'} `" v-for="(item, index) in selectedAnswerList" :key="index">
          <div :class="`text-item-outer${currentTab === 1 ? '1' : '5'} ${flag_1 ? 'dash-outer' : 'full-text-area'}`"
            >
            <div
              v-if="shouldShow(item)"
              :class="item.star ? 'text-list-item star_bg' : 'text-list-item'"
            >
              <div :class="`text_area ${!flag_1 && 'full-text-area'}`" >
                <div :class="`remark-item-content ${item.type === 'text' && 'content-text-scroll'}`">
                  <VideoPlayer
                    v-if="item.content.mediaType === 'video'"
                    controlslist="nodownload"
                    controls=""
                    :src="item.content.link"
                    preload="auto"
                    style="height: 150px"
                  />
                  <audio-player v-else-if="item.content.mediaType === 'audio'" :url="item.content.link"/>
                  <div
                    class="remark-file"
                    v-else-if="item.content.mediaType === 'file'"
                  >
                    <file-answer-icon :item="item" :className="`${currentTab === 1 ? '' : 'smallicon'}`"/>
                    <div class="file-name" style="flex: 1">
                      <p class="file-name">{{item.content.fileName}}</p>
                      <a :href="item.content.link" target="_blank"  download class="download-text">Download</a>
                    </div>
                  </div>
                  <div class="answer-image" v-else-if="item.content.mediaType === 'image'">
                    <Base64image :url="item.content.link" />
                  </div>
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
                    answertime: item.updated_at,
                    id: item.id
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
    <loading-view v-else/>
  </div>
</template>

<script>
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapState, mapGetters } from 'vuex'
import StudentQuestions from '../students/studentQuestions.vue';
import StudentRemark from '../students/studentRemark.vue';
import AudioPlayer from '../common/audioPlayer.vue';
import Base64image from '../base64image.vue';
import CommonSwitchTab from './commonSwitchTab.vue';
import LoadingView from './loadingView.vue';
import FileAnswerIcon from '../common/fileAnswerIcon.vue';
export default {
  computed: {
    // 未答题学生
    // noAnswerStudents() {
    //   let noList = []
    //   for(let i = 0; i < this.studentList.length; i++) {
    //     const currentUser = this.studentList[i]
    //     const index = this.answerList.findIndex(item => item.user_id === currentUser.user_id)
    //     if(index === -1) {
    //       noList.push(currentUser)
    //     }
    //   }
    //   return noList
    // },
    selectedAnswerList() {
      if(this.selectedGroupMembers.length === 0) return this.answerList
      let list = this.answerList.filter(item => {
        return this.selectedGroupMembers.indexOf(item.user_id) > -1
      })
      return list
    },
    ...mapState({
      studentList: state => state.teacher.studentList,
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList',
      currentPageId: 'student/currentPageId',
      selectedGroupMembers: 'student/selectedGroupMembers'
    }),
    answerList() {
      let list = this.currentPageAnswerList.map(item => {
        const content = item.content || JSON.parse(item.data).content
        let data = {}
        try {
          data = JSON.parse(item.data)
        } catch(e) {}
        return {
          ...item,
          id: item.id || item.response_id,
          content,
          ...data
        }
      })
      list = this.resortList(list)
      // console.log(list)
      return list;
    },
  },
  components: { StudentResponseOptBar, StudentQuestions, StudentRemark, AudioPlayer, Base64image, CommonSwitchTab, LoadingView, FileAnswerIcon },
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
            const precontent = prev.content.link
            const nextcontent = next.content.link
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
    },
    getIconClass(name) {
      if(!name) return 'file'
      name = name.toLocaleLowerCase()
      if(name.indexOf('.pdf') > -1) return 'pdf'
      if(name.indexOf('.doc') > -1) return 'word'
      return 'file'
    }
  },
};
</script>
