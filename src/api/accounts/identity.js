/**
 * 身份管理
 */
import request from '@/utils/request'
const PREFIX = '/v1/admin-user'

/**
 * 获取身份管理列表
 */
export function getIdentifys (params) {
  return request({
    url: PREFIX + '/identifys',
    method: 'get',
    params
  })
}

/**
 * 添加部门
 * @param {String} name 部门名称
 * @param {String} parent_id 一级分类id = 0
 */
export function addDepartment (data) {
  return request({
    url: PREFIX + '/departments',
    method: 'post',
    data
  })
}

/**
 * 查看部门详情
 * @param {Number} id 部门id
 */
export function getDepartmentDetail (id) {
  return request({
    url: PREFIX + '/departments/' + id,
    method: 'get'
  })
}

/**
 * 修改部门
 * @param {String} name 部门id
 */
export function editDepartment (data) {
  return request({
    url: PREFIX + '/departments/' + data.id,
    method: 'patch',
    data
  })
}

/**
 * 删除部门
 * @param {Number} id 部门id
 */
export function delDepartment (id) {
  return request({
    url: PREFIX + '/departments/' + id,
    method: 'delete'
  })
}

/**
 * 添加身份
 * @param {String} name
 * @param {Number} parent_id 0为该部门下顶级身份
 * @param {Number} department_id 部门id
 */
export function addRole (data) {
  return request({
    url: PREFIX + '/identifys',
    method: 'post',
    data
  })
}

/**
 * 获取身份详情
 * @param {Number} id 身份id
 */
export function getRoleDetail (id) {
  return request({
    url: PREFIX + '/identifys/' + id,
    method: 'get'
  })
}

/**
 * 修改身份
 * @param {Number} id 身份id
 * @param {String} name
 * @param {Number} department_id 部门id
 */
export function editRole (data) {
  return request({
    url: PREFIX + '/identifys/' + data.id,
    method: 'patch',
    data
  })
}

/**
 * 删除身份
 * @param {Number} id 身份id
 */
export function delRole (id) {
  return request({
    url: PREFIX + '/identifys/' + id,
    method: 'delete'
  })
}

// 获取身份权限
export function getIdentityPermission (id) {
  return request({
    url: `${PREFIX}/identifys/${id}/permissions`,
    method: 'get'
  })
}

// 设置身份权限
export function setIdentityPermission (data) {
  return request({
    url: `${PREFIX}/identifys/${data.id}/permissions`,
    method: 'post',
    data
  })
}
