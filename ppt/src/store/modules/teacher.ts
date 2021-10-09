import { TeacherActionTypes } from "./types"

const state = () => ({
  studentList: [],
  showDashFullResponse: false,
  allGroups: []
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

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
