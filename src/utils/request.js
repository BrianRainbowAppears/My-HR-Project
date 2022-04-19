import axios from 'axios'
import store from '@/store'
import { removeToken } from './auth'
import router from '@/router'

// 后端接口的基准路径
// const baseURL = 'http://ihrm-java.itheima.net/api/'
const baseURL = process.env.VUE_APP_BASE_API

const instance = axios.create({
  baseURL: baseURL
})

// 请求拦截器
instance.interceptors.request.use(config => {
  // 统一添加请求头
  const token = store.getters.token
  if (token) {
    // 统一添加请求头
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (err) => {
  return Promise.reject(err)
})

// 添加响应拦截器
instance.interceptors.response.use(res => {
  // 去掉一层data属性
  return res.data
}, (err) => {
  // 判断token是否失效
  if (err.response.status === 401) {
    // token失效了，清除用户信息和失效的token，跳转到登录页面
    store.commit('user/setToken', null)
    store.commit('user/updateUserInfo', null)
    removeToken()
    router.push('/login')
  }
  return Promise.reject(err)
})

// export default instance
// 为何要采用如下方式封装？需要达到目标（无论何种请求方式都采用data传递参数即可）
export default (options) => {
  // 根据请求方式决定请求参数的名称
  let key = ''
  if (options.method) {
    key = options.method.toUpperCase() === 'GET' ? 'params' : 'data'
  } else {
    // 没有传递method,此时采用默认请求方式get
    key = 'params'
  }
  return instance({
    method: options.method || 'get',
    url: options.url,
    // ES6规则：对象的key可以是变量
    [key]: options.data
  })
}

// 现在要达成一个目标：无论采用何种请求方式，都用data进行参数传递
// 调用代码
// import request from '@/utils/request'

// request({
//   method: 'get',
//   url: '#',
//   params: {
//     username: 'admin',
//     password: '123456'
//   }
// })

// request({
//   method: 'Get',
//   url: '#',
//   data: {
//     username: 'admin',
//     password: '123456'
//   }
// }).then(ret => {})

