import request from '@/utils/request'

// 查询用户列表
export function get(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 新增用户
export function add(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

// 修改用户
export function edit(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

// 删除用户
export function del(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

export default { get, add, edit, del }