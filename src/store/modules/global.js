const state = {
  count: 10
}

const mutations = {
  // 定义mutation，用于修改state的数据
  updateCount (state, payload) {
    state.count = state.count + payload
  }
}

const actions = {
  updateCount (context, payload) {
    // context 可以看做 $store
    setTimeout(() => {
      // 2秒后触发mutation变更状态数据
      context.commit('updateCount', payload)
    }, 2000)
  }
}

const getters = {
  points: state => state.user.userInfo && state.user.userInfo.roles.points,
  routes: state => state.permission.list,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo && state.user.userInfo.staffPhoto,
  username: state => state.user.userInfo && state.user.userInfo.username,
  name: state => state.user.name,
  // getters可以基于state中已有的数据生成另一种数据
  specialCount: state => '<' + (state.count + 100) + '>'
}

export default {
  // 全局的配置
  state,
  mutations,
  actions,
  getters
}
