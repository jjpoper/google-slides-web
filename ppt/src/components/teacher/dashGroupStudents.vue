<template>
  <div class="res-and-student" >
    <div class="res-inner">
      <div class="dash-pad-hidden">
        <dash-groups-select />
      </div>
      <ul class="res-list">
        <template  v-for="item in studentList" >
          <li :class="`student-list-item ${noAnswerStudents.indexOf(item.user_id) > -1 && 'disable'}`"
            v-if="!currentGroupId || currentGroupMembers.indexOf(item.user_id) > -1" :key="item.user_id"
            @click="selectUsers(item)">
            <img src="../../assets/picture/student-no-ans.png" class="ans-status" v-if="noAnswerStudents.indexOf(item.user_id) > -1"/>
            <img src="../../assets/picture/student-answered.png" class="ans-status" v-else/>
            <div :class="`user-icon student-icon ${getSelected(item.user_id)}`">{{item.name ? item.name.substr(0, 1) : ''}}</div>
            <div class="user-name" :title="item.name">{{item.name.split("@")[0]}}</div>
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
<script>
import { getAnswerTimeStr, getJSONValue } from '@/utils/help'
import { mapState, mapGetters, mapActions } from 'vuex'
import dashGroupsSelect from './dashGroupsSelect.vue'
export default {
  components: { dashGroupsSelect },
  computed: {
    ...mapState({
      studentList: state => state.teacher.studentList,
      allGroups: state => {
        return state.teacher.allGroups.filter(item => item.members && item.members.length > 0)
      },
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
  data() {
    return {
      currentGroupId: '',
      selectedStudents: false, // 是否选中学生
    }
  },
  methods: {
    ...mapActions("teacher", ["changeSelectedGroup", "changeGroupMembers"]),
    changeGroup(id) {
      this.selectedStudents = false
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
      this.selectedStudents = true
      const {user_id} = item
      const newList = this.selectedGroupMembers.concat([])
      const index = newList.indexOf(user_id)
      if(index > -1) {
        newList.splice(index, 1)
      } else {
        newList.push(user_id)
      }
      this.changeSelectedGroup(newList)
    },
    getSelected(user_id) {
      if(this.selectedStudents) {
        const list = this.selectedGroupMembers
        const isSelected = list.length > 0 && list.indexOf(user_id) > -1
        return isSelected ? 'selected' : ''
      }
    }
  }
}
</script>
<style scoped>
  
  .res-inner{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    background-color: #ebe7e7;
    border: 1px solid rgba(216, 216, 216, 1);
    border-radius: 4px;
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
    line-height: 52px;
    text-align: center;
    font-size: 20px;
    font-family: Inter-Bold;
    color: #fff;
    background-color: #afafaf;
  }
  .user-icon.selected{
    background-color: red;
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
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
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