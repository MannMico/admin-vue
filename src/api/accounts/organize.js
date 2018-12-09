/**
 * 运营中心
 */
import request from '@/utils/request'

const PREFIX = '/v1/admin-user'

// 获取运营中心列表
export function getOrganizesList (params) {
  return request({
    url: `${PREFIX}/organizes`,
    method: 'get',
    params
  })
}

// 添加运营中心
export function addOrganize (data) {
  return request({
    url: `${PREFIX}/organizes`,
    method: 'post',
    data
  })
}

// 编辑运营中心
export function editOrganize (data) {
  return request({
    url: `${PREFIX}/organizes/${data.id}`,
    method: 'patch',
    data
  })
}

// 获取运营中心详情
export function getOrganizeDetail (id) {
  return request({
    url: `${PREFIX}/organizes/${id}`,
    method: 'get'
  })
}

// 删除运营中心
export function delOrganize (id) {
  return request({
    url: `${PREFIX}/organizes/${id}`,
    method: 'delete'
  })
}

// 选择城市
export function chooseCitys (id, data) {
  return request({
    url: `${PREFIX}/organizes/${id}/citys`,
    method: 'post',
    data
  })
}

/**
 * 获取全部账户列表
 * ! 用户添加/创建区域选择负责人时使用
 * @param {String} search 名字或手机号
 */
export function getUserListBySearch (params) {
  return request({
    url: '/v1/admin-user/users/all',
    method: 'get',
    params
  })
}
