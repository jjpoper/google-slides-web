<template>
  <div class="res-and-student">
    <div class="res-inner">
      <div class="student-list-item select-header">
        <el-select v-model="currentGroupId" placeholder="All" @change="changeGroup" style="background: #fff">
          <el-option
            label="ALL"
            value="">
          </el-option>
          <el-option
            v-for="item in allGroups"
            :key="item.group_id"
            :label="item.group_name"
            :value="item.group_id">
          </el-option>
        </el-select>
      </div>
      <ul class="res-list">
        <template  v-for="item in studentList" >
          <li :class="`student-list-item ${noAnswerStudents.indexOf(item.user_id) > -1 && 'disable'} ${(selectedGroupMembers.length > 0 && selectedGroupMembers.indexOf(item.user_id) === -1) && 'notSelected'}`"
            v-if="!currentGroupId || currentGroupMembers.indexOf(item.user_id) > -1" :key="item.user_id"
            @click="selectUsers(item)">
            <img src="../../assets/picture/student-no-ans.png" class="ans-status" v-if="noAnswerStudents.indexOf(item.user_id) > -1"/>
            <img src="../../assets/picture/student-answered.png" class="ans-status" v-else/>
            <div class="user-icon student-icon">{{item.name ? item.name.substr(0, 1) : ''}}</div>
            <div class="user-name">{{item.name}}</div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import { getAnswerTimeStr, getJSONValue } from '@/utils/help'
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapState({
      studentList: state => state.teacher.studentList,
      allGroups: state => state.teacher.allGroups,
      selectedGroupMembers: state => state.teacher.selectedGroupMembers,
      currentGroupMembers: state => state.teacher.currentGroupMembers,
      allRemarks: state => state.remark.allRemarks,
      studentAllSlides: state => state.student.studentAllSlides,
      currentPageIndex: state => state.student.currentPageIndex,
    }),
    ...mapGetters({
      currentPageAnswerList: 'student/currentPageAnswerList',
      currentPageId: 'student/currentPageId',
      currentPageAnswerType: 'student/currentPageAnswerType',
    }),
    // 未答题学生
    noAnswerStudents() {
      let noList = []
      for(let i = 0; i < this.studentList.length; i++) {
        const currentUser = this.studentList[i]
        const index = this.answerList.findIndex(item => item.user_id === currentUser.user_id)
        if(index === -1) {
          noList.push(currentUser.user_id)
        }
      }
      console.log(noList, 'nolist')
      return noList
    },
    currentComments() {
      let list = []
      if(this.studentAllSlides.length > 0 && this.allRemarks.length > 0) {
        list = this.allRemarks.filter(
          item => item.page_id === this.currentPageId
        );
      }
      list.reverse()
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
      // console.log(list, 'righten',res, this.currentPageAnswerType)
      return list;
    },
  },
  watch: {
    currentPageAnswerType() {
      if(this.currentPageAnswerType === 'none') {
        // this.changeTab(1)
      }
    },
    currentPageIndex() {
      this.currentGroupId = ''
      this.changeSelectedGroup([])
      this.changeGroupMembers([])
    }
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
      currentGroupId: ''
    }
  },
  methods: {
    ...mapActions("teacher", ["changeSelectedGroup", "changeGroupMembers"]),
    changeTab(tab) {
      this.tab = tab
    },
    getTimeStr(time) {
      if(!time) return ''
      return getAnswerTimeStr(time * 1000);
    },
    changeGroup(id) {
      if(!id) {
        this.changeSelectedGroup([])
        this.changeGroupMembers([])
        return
      }
      const data = this.allGroups.filter(item => item.group_id == id)[0]
      console.log(data)
      const list = data.members.map(item => item.user_id)
      console.log(list)
      this.changeSelectedGroup(list)
      this.changeGroupMembers(list)
    },
    selectUsers(item) {
      console.log(item)
      this.changeSelectedGroup([item.user_id])
    }
  }
}
</script>
<style scoped>
  .res-and-student{
    width: 100%;
    height: 100%;
    position: relative;
    padding: 20px 20px 20px 0;
    box-sizing: border-box;
  }
  .res-inner{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #fff;
    border: 1px solid rgba(216, 216, 216, 1);
    border-radius: 4px;
  }
  .res-list{
    flex: 1;
    overflow-y: scroll;
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
    height: 57px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    box-sizing: border-box;
    cursor: pointer;
  }
  .select-header{
    background-color: #fafafa;
  }
  .disable{
    background-color: rgba(247, 248, 255, 1);
  }
  .notSelected{
    opacity: 0.3;
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