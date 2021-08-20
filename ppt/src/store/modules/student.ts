const state = () => ({
    elements: [],
    currentPageIndex: 0,
    studentAllSlides: [],
    studentUserInfo: {
        name: '',
        icon: '',
        uid: ''
    }
})

// getters
const getters = {
}

// actions
const actions = {
    setElements({ commit }: any, list: any) {
        commit('setElements', JSON.parse(JSON.stringify(list)))
    },
    setStudentPageIndex({ commit }: any, index: number) {
        commit('setIndex', index)
    },
    setStudentAllSlides({ commit }: any, list: any) {
        commit('setAllSlides', JSON.parse(JSON.stringify(list)))
    },
    setStudentUserInfo({ commit }: any, userInfo: any) {
        commit('setStudentUserInfo', JSON.parse(JSON.stringify(userInfo)))
    },
}

// mutations
const mutations = {
    setElements(nextState: any, list: any) {
        nextState.elements = list
    },
    setIndex(nextState: any, index: number) {
        nextState.currentPageIndex = index
    },
    setAllSlides(nextState: any, list: any) {
        nextState.studentAllSlides = list
    },
    setStudentUserInfo(nextState: any, userInfo: any) {
        nextState.studentUserInfo = Object.assign(nextState.studentUserInfo, userInfo)
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
