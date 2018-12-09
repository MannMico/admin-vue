/**
 * 基本功能
 */
import request from '@/utils/request'

// 登录
export function login (data = {}) {
  return request({
    url: '/v1/user/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserInfo () {
  return request({
    url: '/v1/user/show',
    method: 'get'
  })
}

// 退出
export function logout () {
  return request({
    url: '/v1/user/logout',
    method: 'get'
  })
}

const PREFIX = '/v1/common'

// token 刷新
export function refreshToken (val) {
  return request({
    url: PREFIX + '/refresh',
    method: 'post',
    data: {
      'refresh_token': val
    }
  })
}

// 获取用户权限
export function getPermissons () {
  return request({
    url: PREFIX + '/permissions',
    method: 'get'
  })
}

// 获取所有权限
export function getAllPermissions () {
  return request({
    url: `/v1/admin-user/permissions/all`,
    method: 'get'
  })
}

// 获取菜单
export function getMenuList () {
  return request({
    url: PREFIX + '/menulist',
    method: 'get'
  })
}

// 获取腾讯云签名
export function getCosSign () {
  return request({
    url: PREFIX + '/cos/sign',
    method: 'get'
  })
}

// 获取省市
export function getCitys () {
  return request({
    url: PREFIX + '/citys',
    method: 'get'
  })
}
/**
 * 锁定用户
 * @param {Number} lockDate
 * @param {String} userId
 * @param {String} lockMsg
 * @param {String} lockType
 */
export function lockUser (data) {
  return request({
    url: PREFIX + '/lock-user',
    method: 'post',
    data
  })
}
/**
 * 账户操作日志
 * @param {Number} page
 * @param {Number} limit
 * @param {String} type
 * type=user, 查询账户操作日志;
 * type=identify, 查询身份操作日志;
 * type=organize, 查询区域操作日志;
 * type=role, 查询用户组操作日志;
 * type=topic, 查询话题列表操作日志
 * type=topic_type, 查询话题类型列表操作日志
 */
export function operateLog (params) {
  return request({
    url: PREFIX + '/log',
    method: 'get',
    params
  })
}

// 获取身份列表
export function getAllIdentifys () {
  return request({
    url: '/v1/admin-user/identifys/all',
    method: 'get'
  })
}

// 获取运营中心
export function getAllOrganizes () {
  return request({
    url: '/v1/admin-user/organizes/all',
    method: 'get'
  })
}

// 获取用户组
export function getAllRoles () {
  return request({
    url: '/v1/admin-user/roles/all',
    method: 'get'
  })
}

// 获取部门列表
export function getAllDepartments () {
  return request({
    url: '/v1/admin-user/departments',
    method: 'get'
  })
}

/**
 * @param {Number} page
 * @param {Number} limit
 * @param {String} type (user -> 账户操作；identify -> 身份操作；organize -> 区域操作；role -> 用户组操作)
 * @param {Number} modelId 对应操作对象id
 */
export function getLogs (params) {
  return request({
    url: '/v1/common/log',
    method: 'get',
    params
  })
}
