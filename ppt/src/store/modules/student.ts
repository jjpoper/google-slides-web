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
    deleteOnAnswerById({ commit }: any, id: any) {
        commit('deleteOnAnswerById', id)
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
    updateAllAnswerdList(nextState: any, data: any) {
        const {
            allAnswerList,
            studentAllSlides,
            currentPageIndex,
        } = nextState
        if(data.type === 'media') {
            nextState.allAnswerList.push(data)
        } else {
            // const { item_id: itemId, student_user_id: sid, type } = data
            // const pageId = studentAllSlides[currentPageIndex].page_id
            // console.log(itemId, sid, type, pageId, "addItem")
            // let oldDataIndex = -1
            // if(type === 'text') {
            //     oldDataIndex = allAnswerList.findIndex((item: any) => item.page_id === pageId && item.item_id === itemId && item.student_user_id === sid)
            // } else {
            //     // 一条答案数据，去重
            //     oldDataIndex = allAnswerList.findIndex((item: any) => item.page_id === pageId && item.student_user_id === sid)
            // }
            // if(oldDataIndex > -1) {
            //     allAnswerList.splice(oldDataIndex, 1, data)
            // } else {
            //     allAnswerList.push(data)
            // }
        }
    },
    setAllAnswerdList(nextState: any, list: any) {
        nextState.allAnswerList = list
    },
    deleteOnAnswerById(nextState: any, id: any) {
        const index = nextState.allAnswerList.findIndex((item: any) => item.id === id)
        if(index > -1) {
            nextState.allAnswerList.splice(index, 1)
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
