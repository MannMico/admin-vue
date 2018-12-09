/**
 * 权限管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/admin-user'

// 获取权限列表
export function getPermissonsList (params) {
  return request({
    url: `${PREFIX}/permissions`,
    method: 'get',
    params
  })
}

// 添加权限
export function addPermission (data) {
  return request({
    url: `${PREFIX}/permissions`,
    method: 'post',
    data
  })
}

// 获取权限详情
export function getPermissionDetail (id) {
  return request({
    url: `${PREFIX}/permissions/${id}`,
    method: 'get'
  })
}

// 修改权限
export function editPermission (data) {
  return request({
    url: `${PREFIX}/permissions/${data.id}`,
    method: 'post',
    data
  })
}

// 删除权限
export function delPermission (id) {
  return request({
    url: `${PREFIX}/permissions/${id}`,
    method: 'delete'
  })
}

// 获取下级权限
export function getSubPermissonslist (params) {
  return request({
    url: `${PREFIX}/permissions/${params.id}/sub-permissions`,
    method: 'get',
    params
  })
}
