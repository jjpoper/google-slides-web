<template>
  <div class="res-and-student">
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
                <p class="user-name user-time">{{getTimeStr(item.updated_at)}}</p>
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
      return list;
    },
    answerList() {
      const res = this.currentPageAnswerType === 'comment' ? this.currentComments : this.currentPageAnswerList
      let list = res.map(item => {
        const data = item.content ? {} : getJSONValue(item.data)
        return {
          ...item,
          id: item.id || item.response_id,
          ...data
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
<style scoped>
  .res-and-student{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    margin-top: 10px;
  }
  .res-list{
    flex: 1;
    overflow-y: scroll;
  }
  .res-list-item{
    width: 100%;
    height: 280px;
    box-sizing: border-box;
    margin-bottom: 28px;
    padding: 0 28px;
  }
  .res-list-item-content{
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    border: 1px solid #F1F1F1;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.16);
    opacity: 1;
    box-sizing: border-box;
    padding: 18px;
    display: flex;
    flex-direction: column;
  }
  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .user-icon {
    width: 52px;
    height: 52px;
    border-radius: 26px;
    margin-right: 11px;
    background-color: red;
    line-height: 52px;
    text-align: center;
    font-size: 20px;
    font-family: Inter-Bold;
    color: #fff;
  }
  .student-icon{
    width: 44px;
    height: 44px;
    border-radius: 22px;
    line-height: 44px;
  }
  .user-name {
    font-size: 16px;
    font-family: Inter-Bold;
    line-height: 24px;
    color: rgba(0, 0, 0, 1);
    opacity: 1;
    text-align: left;
  }
  .user-time {
    font-size: 10px;
    line-height: 14px;
  }
  .ans-detail{
    flex: 1;
    background-color: rgba(228, 228, 228, 1);
    border-radius: 6px;
  }
  .student-list-item{
    width: 100%;
    height: 77px;
    display: flex;
    align-items: center;
    padding-left: 50px;
    box-sizing: border-box;
  }
  .ans-status{
    width: 21px;
    height: 21px;
    margin-right: 14px;
  }
  .showResButoon{
    width: 120px;
    height: 30px;
    border-radius: 4px;
    background-color: rgba(21, 195, 154, 1);
    font-size: 14px;
    font-family: Inter-Bold;
    line-height: 30px;
    color: #FFFFFF;
    cursor: pointer;
    text-align: center;
    position: relative;
    margin: 0 auto 10px auto;
  }
</style>