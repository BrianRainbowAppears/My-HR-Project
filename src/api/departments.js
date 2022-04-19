import request from '@/utils/request.js'

// 获取部门列表数据
export function reqGetDepartments() {
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
export function reqDelDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 添加部门，调用接口
export function reqAddDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门详情数据
export function reqGetDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门
export function reqUpdateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
