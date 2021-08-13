import Vue from 'vue'
import Vuex, {createLogger} from 'vuex'
import teacher from './modules/teacher.js'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    teacher
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})
