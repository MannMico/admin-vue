/**
 * 账号管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/admin-user'
/**
 * 获取账号列表
 * @param {Number} page
 * @param {Number} limit
 * @param {Number} search 邮箱
 */
export function getAccountList (params) {
  return request({
    url: PREFIX + '/users',
    method: 'get',
    params
  })
}

/**
 * 添加账户
 * @param {String} email
 * @param {String} name
 * @param {Number} phone
 * @param {Number} identifyId 身份
 * @param {String} area 区域
 * @param {Array} organizes 运营中心
 * @param {Array} roles 用户组
 * @param {String} status 状态
 */
export function addUser (data) {
  return request({
    url: PREFIX + '/users',
    method: 'post',
    data
  })
}

/**
 * 修改账户
 * @param {Number} id 账户id
 * @param {String} email
 * @param {String} name
 * @param {Number} phone
 * @param {Number} identifyId 身份
 * @param {String} area 区域
 * @param {Array} organizes 运营中心
 * @param {Array} roles 用户组
 * @param {String} status 状态
 */
export function editUser (data) {
  return request({
    url: PREFIX + '/users/' + data.id,
    method: 'put',
    data
  })
}

/**
 * 获取账号详情
 * @param {Number} id 账户id
 */
export function getUserDetail (id) {
  return request({
    url: PREFIX + '/user/' + id,
    method: 'get'
  })
}

/**
 * 重置账号密码
 * @param {Number} id 账户id
 */
export function resetUserPwd (id) {
  return request({
    url: PREFIX + '/users/' + id + '/password',
    method: 'get'
  })
}

/**
 * 修改状态
 * @param {Number} id 账户id
 */
export function modifyUserStatus (id, data) {
  return request({
    url: PREFIX + '/users/' + id + '/status',
    method: 'patch',
    data
  })
}
