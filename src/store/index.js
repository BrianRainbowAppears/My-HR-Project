import Vue from 'vue'
import Vuex from 'vuex'
// import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import book from './modules/book'
import global from './modules/global'
import permission from './modules/permission'

Vue.use(Vuex)

const store = new Vuex.Store({
  // 局部模块
  modules: {
    app,
    settings,
    user,
    book,
    permission
  },
  // 全局模块
  ...global
})

export default store
