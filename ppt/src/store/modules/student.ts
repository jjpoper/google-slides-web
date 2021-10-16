/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
        const { items, page_id } = studentAllSlides[currentPageIndex]
        if (items.length === 0) return []
        const { type } = items[0]
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
    currentPagePPTData: (currentState: any) => {
        const {
            studentAllSlides,
            currentPageIndex,
        } = currentState
        return studentAllSlides[currentPageIndex]
    },
    currentPageAnswerType: (currentState: any) => {
        const {
            studentAllSlides,
            currentPageIndex,
        } = currentState
        const itemData = studentAllSlides[currentPageIndex]
        const type = itemData.items[0] ? itemData.items[0].type : null
        return type || 'none'
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
    updateSlideItemTip({ commit }: any, data: any) {
        commit('updateSlideItemTip', JSON.parse(JSON.stringify(data)))
    },
    updateSlideCorrectAnswer({ commit }: any, data: any) {
        commit('updateSlideCorrectAnswer', JSON.parse(JSON.stringify(data)))
    },

    setAllGroups({ commit }: any, list: any) {
        commit('setAllGroups', JSON.parse(JSON.stringify(list)))
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
        const { answerdPage } = nextState
        answerdPage[pageIndex] = true
        nextState.answerdPage = JSON.parse(JSON.stringify(answerdPage))
    },
    setAllGroups(nextState: any, list: any) {
        nextState.allGroups = list
    },
    updateAllAnswerdList(nextState: any, data: any) {
        const {
            allAnswerList,
            studentAllSlides,
            currentPageIndex,
        } = nextState
        if (data.type === 'media') {
            nextState.allAnswerList.push(data)
        } else {
            // const { item_id: itemId, student_user_id: sid, type } = data
            // const pageId = studentAllSlides[currentPageIndex].page_id
            // // console.log(itemId, sid, type, pageId, "addItem")
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
        const index = nextState.allAnswerList.findIndex((item: any) => (item.id === id || item.response_id === id))
        if (index > -1) {
            nextState.allAnswerList.splice(index, 1)
        }
    },
    updateSlideItemTip(nextState: any, data: any) {
        // {"page_id":"abc", "tip": "new tip"}
        const studentAllSlides = JSON.parse(JSON.stringify(nextState.studentAllSlides))
        const { page_id, tip } = data
        // const index = allAnswerList.find
        for (let i = 0; i < studentAllSlides.length; i++) {
            if (studentAllSlides[i].page_id === page_id) {
                const index = studentAllSlides[i].elements.findIndex((item: any) => item.type === 'tip')
                studentAllSlides[i].elements[index].tip = tip
                break
            }
        }
        nextState.studentAllSlides = studentAllSlides
    },
    updateSlideCorrectAnswer(nextState: any, data: any) {
        // {"page_id": "abc", "correct_answer": [0, 2]}
        const studentAllSlides = JSON.parse(JSON.stringify(nextState.studentAllSlides))
        const { page_id, correct_answer } = data
        // const index = allAnswerList.find
        for (let i = 0; i < studentAllSlides.length; i++) {
            if (studentAllSlides[i].page_id === page_id) {
                const item = studentAllSlides[i].items[0]
                for (let j = 0; j < item.data.options.length; j++) {
                    if (correct_answer.indexOf(item.data.options[j].id) > -1) {
                        item.data.options[j].isAnswer = true
                    } else {
                        item.data.options[j].isAnswer = false
                    }
                }
                break
            }
        }
        nextState.studentAllSlides = studentAllSlides
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
