const state = () => ({
    elements: []
})

// getters
const getters = {
}

// actions
const actions = {
    setElements({ commit }: any, list: any) {
        commit('setElements', {list: JSON.parse(JSON.stringify(list))})
    }
}

// mutations
const mutations = {
    setElements(nextState: any, { list }: any) {
        nextState.elements = list
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}