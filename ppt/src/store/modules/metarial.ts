import { controlProject } from "@/socket/socket.teacher"

const state = () => ({
  selectedMetarialIds: [], // 当前正在呈现的 metarial
})

// getters
const getters = {
}

// actions
const actions = {
  setSelectedMetarialId({commit}: any, ids: number[]) {
    commit('setSelectedMetarialId', [...ids])
  },
  addSelectedMetarialId({commit}: any, id: number) {
    commit('addSelectedMetarialId', id)
  },
  deleteSelectedMetarialId({commit}: any, id: number) {
    commit('deleteSelectedMetarialId', id)
  },
}

// mutations
const mutations = {
  setSelectedMetarialId(nextState: any, ids: number) {
    nextState.selectedMetarialIds = ids
  },
  addSelectedMetarialId(nextState: any, id: number) {
    const preIds = nextState.selectedMetarialIds
    preIds.push(id)
    nextState.selectedMetarialIds = preIds.slice(-4)
    controlProject({result: preIds, controlType: 7})
  },
  deleteSelectedMetarialId(nextState: any, id: number) {
    let preIds = nextState.selectedMetarialIds
    preIds = preIds.filter((item: number) => item !== id)
    nextState.selectedMetarialIds = preIds
    controlProject({result: preIds, controlType: 7})
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
