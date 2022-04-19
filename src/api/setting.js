// 角色管理
import request from '@/utils/request'

// 获取角色列表
// options = { page: 1, pagesize: 10 }
export function reqGetRoleList(options) {
  return request({
    method: 'get',
    url: '/sys/role',
    data: options
  })
}

// 根据id删除角色
export function reqDeleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 添加角色
export function reqAddRole(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

// 修改角色
export function reqUpdateRole(data) {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 获取角色详情
export function reqGetRoleDetail(id) {
  return request({
    method: 'get',
    url: `/sys/role/${id}`
  })
}

// 给角色分配权限: 角色id和权限列表
export function reqAssignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
