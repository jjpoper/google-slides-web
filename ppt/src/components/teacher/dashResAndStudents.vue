<template>
  <div class="res-and-list">
    <!-- <dash-switch-header /> -->
    <ul class="res-list" v-if="tab === 1">
      <li class="student-list-item" v-for="item in studentList" :key="item.user_id">
        <img src="../../assets/picture/student-answered.png" class="ans-status" v-if="answeredStudents.indexOf(item.user_id) > -1"/>
        <img src="../../assets/picture/student-no-ans.png" class="ans-status" v-else/>
        <div class="user-icon student-icon">{{item.name ? item.name.substr(0, 1) : ''}}</div>
        <div class="user-name">{{item.name}}</div>
      </li>
    </ul>
    <ul class="res-list" v-if="tab === 2">
      <!-- <div  class="showResButoon">{{showResponse ? 'Hide' : 'Show'}} Response</div> -->
      <template v-if="answerList.length > 0">
        <li class="res-list-item" v-for="item in answerList" :key="item.id">
          <div class="res-list-item-content">
            <div class="user-info">
              <div class="user-icon">{{item.user_name ? item.user_name.substr(0, 1) : ''}}</div>
              <div>
                <p class="user-name" v-if="item.user_name">{{item.user_name}}</p>
                <p class="user-name user-time">{{getTimeStr(item.updated_at || item.time)}}</p>
              </div>
            </div>
            <div class="ans-detail">
              <dash-right-remark-item v-if="currentPageAnswerType === 'media'" :item="item"/>
              <dash-right-comment-item v-if="currentPageAnswerType === 'comment'" :item="item"/>
              <dash-right-choice-item v-if="currentPageAnswerType === 'choice'" :item="item"/>
              <dash-right-draw-item v-if="currentPageAnswerType === 'draw'" :item="item" />
              <dash-right-text-item v-if="currentPageAnswerType === 'text'" :item="item" />
            </div>
          </div>
        </li>
      </template>
      <loading-view v-else/>
    </ul>
  </div>
</template>
<script>
import { getAnswerTimeStr, getJSONValue } from '@/utils/help'
import { mapState, mapGetters } from 'vuex'
import dashRightRemarkItem from './dash-answer/dash-right-remark-item.vue'
import DashRightCommentItem from './dash-answer/dash-right-comment-item.vue'
import DashRightChoiceItem from './dash-answer/dash-right-choice-item.vue'
import DashRightDrawItem from './dash-answer/dash-right-draw-item.vue'
import DashRightTextItem from './dash-answer/dash-right-text-item.vue'
import DashSwitchHeader from './dash/dashSwitchHeader.vue'
import LoadingView from './loadingView.vue'
export default {
  components: { dashRightRemarkItem, DashRightCommentItem, DashRightChoiceItem, DashRightDrawItem, DashRightTextItem, DashSwitchHeader, LoadingView },
  computed: {
    ...mapState({
      studentList: state => state.teacher.studentList,
      allRemarks: state => state.remark.allRemarks,
      studentAllSlides: state => state.student.studentAllSlides,
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList',
      currentPageId: 'student/currentPageId',
      currentPageAnswerType: 'student/currentPageAnswerType',
    }),
    // 已答题学生
    answeredStudents() {
      let anList = []
      for(let i = 0; i < this.studentList.length; i++) {
        const currentUser = this.studentList[i]
        const index = this.answerList.findIndex(item => item.user_id === currentUser.user_id)
        if(index > -1) {
          anList.push(currentUser)
        }
      }
      // console.log(noList)
      return anList
    },
    currentComments() {
      let list = []
      if(this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      // list.reverse()
      console.log(list)
      return list;
    },
    answerList() {
      const res = this.currentPageAnswerType === 'comment' ? this.currentComments : this.currentPageAnswerList
      let list = res.map(item => {
        const data = item.content ? {} : getJSONValue(item.data)
        return {
          ...data,
          ...item,
          id: item.id || item.response_id,
        }
      })
      console.log(list, 'righten')
      return list.reverse();
    }
  },
  watch: {
    currentPageAnswerType() {
      if(this.currentPageAnswerType === 'none') {
        // this.changeTab(1)
      }
    },
  },
  props: {
    showResponse: {
      type: Boolean,
      default: false,
    },
    showres: {
      type: Function
    },
  },
  data() {
    return {
      tab: 2
    }
  },
  methods: {
    changeTab(tab) {
      this.tab = tab
    },
    getTimeStr(time) {
      if(!time) return ''
      return getAnswerTimeStr(time * 1000);
    },
  }
}
</script>