import { login, getInfo, getBaseInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router from '@/router'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken() || null,
    userInfo: null,
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  // 更新token信息
  setToken (state, token) {
    state.token = token
  },
  // 更新用户信息
  updateUserInfo (state, info) {
    state.userInfo = info
  }
}

const actions = {
  // 登录功能:调用接口，返回结果token，存储在Vuex中
  async login (context, payload) {
    // context.rootState.user.token
    // context.state
    // console.log(context) log 打印的数据，如果是对象，默认调用toString方法
    console.dir(context)
    // context 相当于 this.$store
    // payload 表示触发action是传递的参数
    // 调用接口实现登录
    try {
      // 获取用户信息（包括用户名）
      const { code, data } = await login(payload)
      if (code === 10000) {
        // 获取后端返回的成功的信息：关键是token
        context.commit('setToken', data)
        // 缓存token到cookie里面
        setToken(data)
        return true
        // return new Promise((resolve) => {
        //   resolve(true)
        // })
      } else {
        // 登录失败
        return false
      }
    } catch {
      // 登录失败
      return false
    }
  },

  // 获取用户信息
  async getInfo (context) {
    const { code, data } = await getInfo()
    // 获取用户头像等信息(上一个请求的返回结果作为下一个请求的参数)
    const { code: acode, data: adata } = await getBaseInfo(data.userId)
    if (code === 10000 && acode === 10000) {
      // 获取成功
      context.commit('updateUserInfo', {
        ...data,
        ...adata
      })
      return data
    } else {
      return null
    }
  },

  // 用户退出
  logout(context) {
    // 清除token和用户信息
    context.commit('setToken', null)
    context.commit('updateUserInfo', null)
    // 删除缓存中的token
    removeToken()
    // 重置路由
    resetRouter()
    // 销毁动态路由的菜单
    // 在局部模块中访问其他模块的mutation或者action，需要添加root选项
    context.commit('permission/updateRoutes', [], {root: true})
    // 跳转到登录页面
    router.push('/login')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

