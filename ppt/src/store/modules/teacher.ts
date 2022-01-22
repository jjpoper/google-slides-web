import { TeacherActionTypes } from "./types"

const state = () => ({
  studentList: [],
  showDashFullResponse: false,
  allGroups: [],
  currentGroupMembers: [], // 分组的学生，用于展示学生列表，肯定是一组
  feedBackList: [], // 老师的feedback回答列表
  feedBackAnswerIds: {}, // 已feedback的id map
})

// getters
const getters = {
}

// actions
const actions = {
  setStudentList({commit}: any, list: any) {
    commit(TeacherActionTypes.SET_STUDENT_LIST, JSON.parse(JSON.stringify(list)))
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
  changeGroupMembers({commit}: any, list: string[]) {
    commit('changeGroupMembers', JSON.parse(JSON.stringify(list)))
  },
  setFeedBackList({commit}: any, list: any) {
    commit('setFeedBackList', JSON.parse(JSON.stringify(list)))
  },
  addFeedBack({commit}: any, data: any) {
    commit('addFeedBack', JSON.parse(JSON.stringify(data)))
  },
  setFeedBackAnswerIds({commit}: any, listMap: any) {
    commit('setFeedBackAnswerIds', JSON.parse(JSON.stringify(listMap)))
  },
  addFeedBackId({commit}: any, id: any) {
    commit('addFeedBackId', id)
  },
}

// mutations
const mutations = {
  [TeacherActionTypes.SET_STUDENT_LIST](nextState: any, list: any) {
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
  changeGroupMembers(nextState: any, list: any) {
    nextState.currentGroupMembers = list
  },
  setFeedBackList(nextState: any, list: any) {
    nextState.feedBackList = list
  },
  addFeedBack(nextState: any, data: any) {
    nextState.feedBackList.unshift(data)
  },
  setFeedBackAnswerIds(nextState: any, listMap: any) {
    nextState.feedBackAnswerIds = listMap
  },
  addFeedBackId(nextState: any, id: any) {
    const nextMap = {...nextState.feedBackAnswerIds}
    nextMap[id] = true
    nextState.feedBackAnswerIds = nextMap
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
