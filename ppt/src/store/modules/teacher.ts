import { TeacherActionTypes } from "./types"

const state = () => ({
  studentList: [],
  showDashFullResponse: false,
  allGroups: [],
  selectedGroupMembers: [], // 选中的学生。用于匹配答案，可能是一组，也可能是一个人
  currentGroupMembers: [], // 分组的学生，用于展示学生列表，肯定是一组
  feedBackList: [], // 老师的feedback回答列表
})

// getters
const getters = {
}

// actions
const actions = {
  setStudentList({commit}: any, list: any) {
    commit(TeacherActionTypes.SET_STUDENT_LIST, {list: JSON.parse(JSON.stringify(list))})
  },
  setDashFullPageResponse({commit}: any, status: boolean) {
    commit('setDashFullPageResponse', status)
  },
  setAllGroups({commit}: any, list: any) {
    commit('setAllGroups', JSON.parse(JSON.stringify(list)))
  },
  updateGroup({commit}: any, data: any) {
    commit('updateGroup', JSON.parse(JSON.stringify(data)))
  },
  changeSelectedGroup({commit}: any, list: string[]) {
    commit('changeSelectedGroup', JSON.parse(JSON.stringify(list)))
  },
  changeGroupMembers({commit}: any, list: string[]) {
    commit('changeGroupMembers', JSON.parse(JSON.stringify(list)))
  },
  setFeedBackList({commit}: any, list: any) {
    commit('setFeedBackList', JSON.parse(JSON.stringify(list)))
  },
  addFeedBack({commit}: any, data: any) {
    commit('addFeedBack', JSON.parse(JSON.stringify(data)))
  },
}

// mutations
const mutations = {
  [TeacherActionTypes.SET_STUDENT_LIST](nextState: any, {list}: any) {
    nextState.studentList = list
  },
  setDashFullPageResponse(nextState: any, status: boolean) {
    nextState.showDashFullResponse = status
  },
  setAllGroups(nextState: any, list: any) {
    nextState.allGroups = list
  },
  updateGroup(nextState: any, data: any) {
    const {allGroups} = nextState
    const index = allGroups.findIndex((item: any) => item.group_id === data.group_id)
    if(index > -1) {
      const newData = {
        ...allGroups[index],
        ...data
      }
      nextState.allGroups.splice(index, 1, newData)
    } else {
      nextState.allGroups.push(data)
    }
  },
  changeSelectedGroup(nextState: any, list: any) {
    nextState.selectedGroupMembers = list
  },
  changeGroupMembers(nextState: any, list: any) {
    nextState.currentGroupMembers = list
  },
  setFeedBackList(nextState: any, list: any) {
    nextState.feedBackList = list
  },
  addFeedBack(nextState: any, data: any) {
    nextState.feedBackList.unshift(data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
