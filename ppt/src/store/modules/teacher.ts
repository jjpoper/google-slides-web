import { TeacherActionTypes } from "./types"

const state = () => ({
  studentList: []
})

// getters
const getters = {
}

// actions
const actions = {
  setStudentList({commit}: any, list: any) {
    commit(TeacherActionTypes.SET_STUDENT_LIST, {list: JSON.parse(JSON.stringify(list))})
  }
}

// mutations
const mutations = {
  [TeacherActionTypes.SET_STUDENT_LIST](nextState: any, {list}: any) {
    nextState.studentList = list
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
