const state = () => ({
  studentList: []
})

// getters
const getters = {
}

// actions
const actions = {
  setStudentList({commit}: any, list: any) {
    commit('setStudentList', { list})
  }
}

// mutations
const mutations = {
  setStudentList(nextState: any, {list}: any) {
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
