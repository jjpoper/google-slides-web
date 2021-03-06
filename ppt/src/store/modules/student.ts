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
    studentFeedBackComments: [], // 老师端评论
    unreadStudentCommentIds: [], // 未读评论
    isStudentPaced: false,
    selectedMembersMap: {}, // 以pageid为key的选择学生
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
        if(items.length === 0) return []
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
    currentFeedList: (currentState: any) => {
        const {
            studentFeedBackComments,
            studentAllSlides,
            currentPageIndex,
            isStudentPaced
        } = currentState
        let list = []
        if(studentAllSlides && studentAllSlides.length > 0) {
            const currentPageId = studentAllSlides[currentPageIndex].page_id
            if(isStudentPaced) {
                list = studentFeedBackComments
            } else {
                list = studentFeedBackComments.filter((item: any) => item.pageId === currentPageId)
            }
        }
        return list
    },
    // 互动题型
    shouldShowPageAnswer: (currentState: any) => {
        const {
            studentAllSlides,
            currentPageIndex,
        } = currentState
        const itemData = studentAllSlides[currentPageIndex]
        const type = itemData.items[0] ? itemData.items[0].type : null
        // if(!type) {
        //    console.log(this.currentPageAnswerType, '====')
        //   this.setDashFullPageResponse(false)
        // }
        return type && type !== null && type !== 'website'
      },
      // 当前选中的学生。用于匹配答案，可能是一组，也可能是一个人
    selectedGroupMembers: (currentState: any) => {
        const {
            selectedMembersMap,
            currentPageIndex
        } = currentState
        return selectedMembersMap[currentPageIndex] || []
    },
}

// actions
const actions = {
    setElements({ commit }: any, list: any) {
        commit('setElements', JSON.parse(JSON.stringify(list)))
    },
    setStudentPageIndex({ commit }: any, index: number) {
        if(!isNaN(index)) {
            commit('setIndex', index)
        }
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

    setStudentFeedBackComment({ commit }: any, list: any) {
        commit('setStudentFeedBackComment', JSON.parse(JSON.stringify(list)))
    },

    addStudentComment({ commit }: any, data: any) {
        commit('addStudentComment', JSON.parse(JSON.stringify(data)))
    },

    delUnreadCommentId({ commit }: any, id: any) {
        commit('delUnreadCommentId', id)
    },

    updateIsStudentPaced({ commit }: any, status: boolean) {
        commit('updateIsStudentPaced', status)
    },

    changeSelectedGroup({commit}: any, list: string[]) {
        commit('changeSelectedGroup', JSON.parse(JSON.stringify(list)))
    },
    updateAnswerStarOrResponse({commit}: any, data: any) {
        commit('updateAnswerStarOrResponse', data)
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
        const oldStudentData = JSON.parse(JSON.stringify(nextState.allAnswerList))
        const {type} = data
        const {
            studentAllSlides,
            currentPageIndex
        } = nextState
        if(data.type === 'media') {
            nextState.allAnswerList.push(data)
        } else {
            // const { item_id: itemId, student_user_id: sid, type } = data
            const pageId = studentAllSlides[currentPageIndex].page_id
            const { item_id: itemId } = data
            let oldDataIndex = -1
            if(type === 'choice' || type === 'draw') {
                // 一条答案数据，去重
                oldDataIndex = oldStudentData.findIndex((item: any) => item.page_id === pageId)
            } else {
                oldDataIndex = oldStudentData.findIndex((item: any) => {
                    return item.page_id === pageId && item.item_id === itemId
                })
            }

            if(oldDataIndex > -1) {
                oldStudentData[oldDataIndex] = data
            } else {
                oldStudentData.push(data)
            }
            nextState.allAnswerList = oldStudentData
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
    setStudentFeedBackComment(nextState: any, list: any[]) {
        nextState.studentFeedBackComments = list
    },
    addStudentComment(nextState: any, data: any) {
        // const {
        //     studentComment,
        //     unreadStudentCommentIds
        // } = nextState
        nextState.studentFeedBackComments.unshift(data)
        nextState.unreadStudentCommentIds.push(data.id)
    },
    delUnreadCommentId(nextState: any, id: any) {
        const {
            unreadStudentCommentIds
        } = nextState
        const index = unreadStudentCommentIds.indexOf(id)
        if(index > -1) {
            nextState.unreadStudentCommentIds.splice(index, 1)
        }
    },
    updateIsStudentPaced(nextState: any, status: boolean) {
        nextState.isStudentPaced = status
    },
    changeSelectedGroup(nextState: any, list: any) {
        const obj = JSON.parse(JSON.stringify(nextState.selectedMembersMap))
        obj[nextState.currentPageIndex] = list
        nextState.selectedMembersMap = obj
    },
    updateAnswerStarOrResponse(nextState: any, data: any) {
        const oldStudentData = JSON.parse(JSON.stringify(nextState.allAnswerList))
        const oldDataIndex = oldStudentData.findIndex((item: any) => item.id == data.id)
        if(oldDataIndex > -1) {
            oldStudentData[oldDataIndex] = {
                ...oldStudentData[oldDataIndex],
                ...data
            }
            nextState.allAnswerList = oldStudentData
        }
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
