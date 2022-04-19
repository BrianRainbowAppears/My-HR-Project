// 权限管理
import { constantRoutes, dynamicRouters } from '@/router'

const state = () => {
  return {
    // 所有的路由信息：包括静态路由和动态路由
    list: constantRoutes
  }
}
const mutations = {
  // 合并静态路由和动态路由
  updateRoutes (state, drouters) {
    state.list = [...constantRoutes, ...drouters]
  }
}

const actions = {
  filterAuth (context, menus) {
    // 从全部的动态路由中过滤出拥有权限的路由
    const authRouter = dynamicRouters.filter(item => {
      return menus.includes(item.children[0].name)
    })
    // 把动态路由和静态路由合并
    context.commit('updateRoutes', authRouter)
    // 返回过滤出的动态路由
    return authRouter
  }
}

const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
