import { ModalEventsTypeEnum } from "@/socket/socketEvents"
import { RemarkActionTypes } from "./types"

const state = () => ({
  isRemark: false,
  allRemarks: [], // 全部remark数据
  showRemarkModal: false,
  enablePointer: false,
  currentInputType: ModalEventsTypeEnum.TEXT,
  currentRemarkIndex: -1, // 默认不选中
  isInputing: false,
  currentRemarkOptions: null
})

// getters
const getters = {
}

// actions
const actions = {
  // 缓存待提交的 remark 数据
  setCurrentRemarkOptions({commit}: any, options: any) {
    commit(RemarkActionTypes.SET_CURRENT_REMARK_OPTIONS, JSON.parse(JSON.stringify(options)))
  },
  setIsRemark({commit}: any, isRemark: boolean) {
    commit(RemarkActionTypes.SET_IS_REMARK, isRemark)
  },
  setIsInputing({commit}: any, isInputing: boolean) {
    commit(RemarkActionTypes.SET_IS_INPUTING, isInputing)
  },
  showRemarkModal({commit}: any, visible: boolean) {
    commit(RemarkActionTypes.SHOW_REMARK_MODAL, visible)
  },
  setAllRemarkList({commit}: any, list: any) {
    commit(RemarkActionTypes.SET_ALL_REMARK_LIST, JSON.parse(JSON.stringify(list)))
  },
  addOneRemarkItem({commit}: any, listItem: any) {
    commit(RemarkActionTypes.ADD_ONE_REMARK_ITEM, JSON.parse(JSON.stringify(listItem)))
  },
  deleteOneRemarkItem({commit}: any, index: number) {
    commit(RemarkActionTypes.DELETE_ONE_REMARK_ITEM, index)
  },
  updateOneRemarkItem({commit}: any, listItem: any) {
    commit(RemarkActionTypes.UPDATE_ONE_REMARK_ITEM, JSON.parse(JSON.stringify(listItem)))
  },
  enablePointer({commit}: any, enable: boolean) {
    commit(RemarkActionTypes.ENABLE_POINTER, enable)
  },
  updateLatestRemarkId({commit}: any, id: string) {
    commit(RemarkActionTypes.UPDATE_LATEST_REMAK_ID, id)
  },
  changeRemarkInputType({commit}: any, type: string) {
    commit(RemarkActionTypes.CHANGE_REMARK_INPUT_TYPE, type)
  },
  changeRemarkIndex({commit}: any, index: number) {
    commit(RemarkActionTypes.CHANGE_REMARK_INDEX, index)
  },
  updateCommentStarOrResponse({commit}: any, data: any) {
    commit('updateCommentStarOrResponse', data)
  },
}

// mutations
const mutations = {
  [RemarkActionTypes.SET_CURRENT_REMARK_OPTIONS](nextState: any, options: any) {
    nextState.currentRemarkOptions = options
  },
  [RemarkActionTypes.SET_IS_REMARK](nextState: any, isRemark: boolean) {
    nextState.isRemark = isRemark
  },
  [RemarkActionTypes.SET_IS_INPUTING](nextState: any, isInputing: boolean) {
    nextState.isInputing = isInputing
  },
  [RemarkActionTypes.SHOW_REMARK_MODAL](nextState: any, showRemarkModal: any) {
    nextState.showRemarkModal = showRemarkModal
  },
  [RemarkActionTypes.SET_ALL_REMARK_LIST](nextState: any, list: any) {
    nextState.allRemarks = list
  },
  [RemarkActionTypes.ENABLE_POINTER](nextState: any, enablePointer: any) {
    nextState.enablePointer = enablePointer
  },
  [RemarkActionTypes.UPDATE_LATEST_REMAK_ID](nextState: any, id: any) {
    const {allRemarks} = nextState
    const index = Math.max(allRemarks.length - 1, 0)
    allRemarks[index].id = id
    nextState.allRemarks = allRemarks
  },
  [RemarkActionTypes.CHANGE_REMARK_INPUT_TYPE](nextState: any, type: any) {
    nextState.currentInputType = type
  },
  [RemarkActionTypes.CHANGE_REMARK_INDEX](nextState: any, index: any) {
    nextState.currentRemarkIndex = index
  },
  [RemarkActionTypes.ADD_ONE_REMARK_ITEM](nextState: any, item: any) {
    nextState.allRemarks.push(item)
  },
  [RemarkActionTypes.DELETE_ONE_REMARK_ITEM](nextState: any, index: number) {
    nextState.allRemarks.splice(index, 1)
  },
  [RemarkActionTypes.UPDATE_ONE_REMARK_ITEM](nextState: any, listItem: any) {
    const index = nextState.allRemarks.findIndex((item: any) => item.id === listItem.id)
    const currentData = nextState.allRemarks[index]
    nextState.allRemarks.splice(index, 1, {
      ...currentData,
      ...listItem
    })
  },
  updateCommentStarOrResponse(nextState: any, data: any) {
    const index = nextState.allRemarks.findIndex((item: any) => item.id === data.id)
    const currentData = nextState.allRemarks[index]
    nextState.allRemarks.splice(index, 1, {
      ...currentData,
      ...data
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
