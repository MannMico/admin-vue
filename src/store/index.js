/**
 * 组装模块并导出 store 的地方
 */
import Vue from 'vue'
import Vuex from 'vuex'
import common from './modules/common'
import permisson from './modules/permisson'
import user from './modules/user'
import behavior from './modules/behavior'
import tagsView from './modules/tagsView'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    common,
    permisson,
    user,
    behavior,
    tagsView
  },
  getters
})
