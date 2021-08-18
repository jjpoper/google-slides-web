import Vue from 'vue'
import Vuex, { createLogger } from 'vuex'
import teacher from './modules/teacher'
import student from './modules/student'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    teacher,
    student
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
