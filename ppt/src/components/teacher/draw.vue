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
                <div :class="`text_area ${!flag_1 && 'full-text-area'}`" >
                  <div class="answer-image remark-item-content">
                    <Base64image :url="currentPPTUrl">
                      <Base64image :url="item.result">
                      </Base64image>
                    </Base64image>
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
                      title: item.result,
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
  </div>
</template>

<script>
import StudentResponseOptBar from "./studentResponseOptBar.vue";
import { mapState, mapGetters } from 'vuex'
import Base64image from '../base64image.vue';
import CommonSwitchTab from './commonSwitchTab.vue';
export default {
  computed: {
    // 未答题学生
    noAnswerStudents() {
      let noList = []
      for(let i = 0; i < this.studentList.length; i++) {
        const currentUser = this.studentList[i]
        const index = this.answerList.findIndex(item => item.user_id === currentUser.user_id)
        if(index === -1) {
          noList.push(currentUser)
        }
      }
      return noList
    },
    selectedAnswerList() {
      if(this.selectedGroupMembers.length === 0) return this.answerList
      let list = this.answerList.filter(item => {
        return this.selectedGroupMembers.indexOf(item.user_id) > -1
      })
      return list
    },
    ...mapState({
      studentList: state => state.teacher.studentList,
      currentPageIndex: state => state.student.currentPageIndex,
      studentAllSlides: state => state.student.studentAllSlides,
      selectedGroupMembers: state => state.teacher.selectedGroupMembers,
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList'
    }),
    answerList() {
      let list = this.currentPageAnswerList.map(item => {
        let stringData = {}
        try {
          stringData = JSON.parse(item.data)
        } catch(e) {
          // console.log(e)
        }
        // console.log(stringData)
        return {
          ...item,
          ...stringData
        }
      })
      list = this.resortList(list)
      // console.log(list)
      return list;
    },
    currentPPTUrl() {
      return this.studentAllSlides[this.currentPageIndex].thumbnail_url
    }
  },
  components: { StudentResponseOptBar, Base64image, CommonSwitchTab },
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

