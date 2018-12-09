/**
 * 报名模板模块
 */
import request from '@/utils/request'

const PREFIX = '/v1/b-conference'
// const baseURL = 'http://admin.api.dev.lkker.cn'

// 获取报名活动列表
export function getEnrollList (params) {
  return request({
    url: `${PREFIX}/sign-up`,
    method: 'get',
    params
  })
}

// 获取报名用户列表
export function getEnrollUserList (params) {
  return request({
    url: `${PREFIX}/sign-up/users/${params.id}`,
    method: 'get',
    params
  })
}

// 创建报名模板
export function createEnroll (data) {
  return request({
    url: `${PREFIX}/sign-up`,
    method: 'post',
    data
  })
}

// 获取报名模板详情
export function getEnrollDetail (id) {
  return request({
    url: `${PREFIX}/sign-up/${id}`,
    method: 'get'
  })
}

// 编辑报名模板
export function editEnroll (data) {
  return request({
    url: `${PREFIX}/sign-up/${data.id}`,
    method: 'post',
    data
  })
}
