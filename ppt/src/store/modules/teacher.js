const state = () => ({
  studentList: []
})

// getters
const getters = {
}

// actions
const actions = {
  setStudentList({commit}, list) {
    commit('setStudentList', { list})
  }
}

// mutations
const mutations = {
  setStudentList(nextState, {list }) {
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
