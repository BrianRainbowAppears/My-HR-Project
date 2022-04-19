import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post',
    data: { token }
  })
}

// 获取用户头像等相关信息
export function getBaseInfo (id) {
  return request({
    url: '/sys/user/' + id,
    method: 'get'
  })
}
