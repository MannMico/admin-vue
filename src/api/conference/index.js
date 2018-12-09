/**
 * 大会模板模块
 */
import request from '@/utils/request'

const PREFIX = '/v1/b-conference'
// const baseURL = 'http://admin.api.dev.lkker.cn'

// 获取大会列表
export function getConferenceList (params) {
  return request({
    url: `${PREFIX}/conference-list`,
    method: 'get',
    params
  })
}
// 创建大会
export function createConference (data) {
  return request({
    url: `${PREFIX}/conference-create`,
    method: 'post',
    data
  })
}
// 保存具体模板
export function saveModule (data) {
  return request({
    url: `${PREFIX}/module-save`,
    method: 'post',
    data
  })
}

// 大会优惠券列表
export function getConferenceCouponList (params) {
  return request({
    url: `${PREFIX}/conference-coupon-list`,
    method: 'get',
    params
  })
}

// 优惠券领取列表
export function getCouponzReceiveList (params) {
  return request({
    url: `${PREFIX}/coupon-receive-list`,
    method: 'get',
    params
  })
}

// 获取大会详情
export function getConferenceDetail (id) {
  return request({
    url: `${PREFIX}/conference/${id}`,
    method: 'get'
  })
}

// 删除大会某个模版
export function deleteModule (id) {
  return request({
    url: `${PREFIX}/modules/${id}`,
    method: 'delete'
  })
}

// 保存模版排序
export function saveModuleSort (data) {
  return request({
    url: `${PREFIX}/sort`,
    method: 'post',
    data
  })
}

// 创建和编辑优惠券
export function couponPost (data) {
  return request({
    url: `${PREFIX}/coupon-save`,
    method: 'post',
    data
  })
}

// 删除优惠券
export function deleteCoupon (id) {
  return request({
    url: `${PREFIX}/coupon/${id}`,
    method: 'delete'
  })
}
