const state = () => ({
    elements: [],
    currentPageIndex: 0,
    studentAllSlides: [],
    studentUserInfo: {
        name: '',
        icon: '',
        uid: ''
    },
    answerdPage: {}, // 已回答page
    allAnswerList: [], // 全部回答数据
})

// getters
const getters = {
    // 本页的全部回答数据
    currentPageAnswerList: (currentState: any) => {
        const {
            studentAllSlides,
            currentPageIndex,
            allAnswerList
        } = currentState
        const {items, page_id} = studentAllSlides[currentPageIndex]
        if(items.length === 0) return []
        const {type} = items[0]
        const answers = allAnswerList.filter((item: any) => item.page_id === page_id && item.type === type)
        return answers
    },
    currentPageId: (currentState: any) => {
        const {
            studentAllSlides,
            currentPageIndex,
        } = currentState
        return studentAllSlides[currentPageIndex].page_id
    },
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
    updateAnswerdPage({ commit }: any, pageIndex: string) {
        commit('updateAnswerdPage', pageIndex)
    },
    updateAllAnswerdList({ commit }: any, item: any) {
        commit('updateAllAnswerdList', JSON.parse(JSON.stringify(item)))
    },
    setAllAnswerdList({ commit }: any, list: any) {
        commit('setAllAnswerdList', JSON.parse(JSON.stringify(list)))
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
    updateAnswerdPage(nextState: any, pageIndex: number) {
        const {answerdPage} = nextState
        answerdPage[pageIndex] = true
        nextState.answerdPage = JSON.parse(JSON.stringify(answerdPage))
    },
    updateAllAnswerdList(nextState: any, item: any) {
        nextState.allAnswerList.push(item)
    },
    setAllAnswerdList(nextState: any, list: any) {
        nextState.allAnswerList = list
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
