/**
 * 用户组管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/admin-user'

// 获取用户组列表
export function getRoleList (params) {
  return request({
    url: `${PREFIX}/roles`,
    method: 'get',
    params
  })
}

// 添加用户组
export function addRole (data) {
  return request({
    url: `${PREFIX}/roles`,
    method: 'post',
    data
  })
}

// 编辑用户组
export function editRole (data) {
  return request({
    url: `${PREFIX}/roles/${data.id}`,
    method: 'patch',
    data
  })
}

// 获取用户组详情
export function getRoleDetail (id) {
  return request({
    url: `${PREFIX}/roles/${id}`,
    method: 'get'
  })
}

// 删除用户组
export function delRole (id) {
  return request({
    url: `${PREFIX}/roles/${id}`,
    method: 'delete'
  })
}

// 获取用户组权限
export function getRolesPermission (id) {
  return request({
    url: `${PREFIX}/roles/${id}/permissions`,
    method: 'get'
  })
}

// 设置用户组权限
export function setRolesPermission (data) {
  return request({
    url: `${PREFIX}/roles/${data.id}/permissions`,
    method: 'post',
    data
  })
}
