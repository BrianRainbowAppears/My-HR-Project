// 基于原生js操作cookie很麻烦，所以可以借助第三方包实现
import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

// 获取cookie
export function getToken() {
  return Cookies.get(TokenKey)
}

// 设置cookie
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

// 删除丛刻
export function removeToken() {
  return Cookies.remove(TokenKey)
}
