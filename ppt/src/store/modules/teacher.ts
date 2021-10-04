import { TeacherActionTypes } from "./types"

const state = () => ({
  studentList: [],
  showDashFullResponse: false
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
}

// mutations
const mutations = {
  [TeacherActionTypes.SET_STUDENT_LIST](nextState: any, {list}: any) {
    nextState.studentList = list
  },
  setDashFullPageResponse(nextState: any, status: boolean) {
    nextState.showDashFullResponse = status
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
