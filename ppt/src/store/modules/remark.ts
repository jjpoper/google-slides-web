import { RemarkActionTypes } from "./types"

const state = () => ({
  allRemarks: [], // 全部remark数据
  showRemarkModal: false,
  currentReamrkList: [],
  enablePointer: false
})

// getters
const getters = {
}

// actions
const actions = {
  showRemarkModal({commit}: any, visible: boolean) {
    commit(RemarkActionTypes.SHOW_REMARK_MODAL, visible)
  },
  setCurrentRemarkList({commit}: any, list: any) {
    commit(RemarkActionTypes.SET_REMARK_LIST, JSON.parse(JSON.stringify(list)))
  },
  setAllRemarkList({commit}: any, list: any) {
    commit(RemarkActionTypes.SET_ALL_REMARK_LIST, JSON.parse(JSON.stringify(list)))
  },
  enablePointer({commit}: any, enable: boolean) {
    commit(RemarkActionTypes.ENABLE_POINTER, enable)
  },
  updateLatestRemarkId({commit}: any, id: string) {
    commit(RemarkActionTypes.UPDATE_LATEST_REMAK_ID, id)
  },
}

// mutations
const mutations = {
  [RemarkActionTypes.SHOW_REMARK_MODAL](nextState: any, showRemarkModal: any) {
    nextState.showRemarkModal = showRemarkModal
  },
  [RemarkActionTypes.SET_REMARK_LIST](nextState: any, list: any) {
    nextState.currentReamrkList = list
  },
  [RemarkActionTypes.SET_ALL_REMARK_LIST](nextState: any, list: any) {
    nextState.allRemarks = list
  },
  [RemarkActionTypes.ENABLE_POINTER](nextState: any, enablePointer: any) {
    nextState.enablePointer = enablePointer
  },
  [RemarkActionTypes.UPDATE_LATEST_REMAK_ID](nextState: any, id: any) {
    nextState.allRemarks[nextState.allRemarks.length - 1].id = id
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
