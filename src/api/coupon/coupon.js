/**
 * 评论管理
 */
import request from '@/utils/request'

const PREFIX = '/v1/coupon/coupons'

/**
 * 搜索创建人
 */
export function searchPerson (params) {
  return request({
    url: '/v1/admin-user/users',
    method: 'get',
    params
  })
}

/**
 * 获取优惠券列表
 */
export function initListData (params) {
  return request({
    url: PREFIX,
    method: 'get',
    params
  })
}
/**
 * 创建优惠券
 */
export function creatCoupon (data) {
  return request({
    url: PREFIX,
    method: 'post',
    data
  })
}

/**
 * 更新优惠券
 */
export function editCoupon (id, data) {
  return request({
    url: '/v1/coupon/coupons/' + id,
    method: 'put',
    data
  })
}

/**
 * 优惠券使用详情
 */
export function couponUseInfo (id, params) {
  return request({
    url: '/v1/coupon/coupons/' + id + '/usage',
    method: 'get',
    params
  })
}

/**
 * 优惠券使用详情
 */
export function couponBasicInfo (id) {
  return request({
    url: PREFIX + '/' + id,
    method: 'get'
  })
}

/**
 * 审核优惠券
 */
export function couponCheck (id, data) {
  return request({
    url: PREFIX + '/' + id + '/checking',
    method: 'put',
    data
  })
}

/**
 * 验证优惠券
 */
export function verifiriCoupon (data) {
  return request({
    url: '/v1/coupon/coupons/verification',
    method: 'post',
    data
  })
}

/**
 * 停止优惠券
 */
export function stopProgress (id) {
  return request({
    url: '/v1/coupon/coupons/' + id + '/stoping',
    method: 'put'
  })
}

/**
 * 获取优惠券码详情
 */
export function getCouponCodeInfo (code) {
  return request({
    url: '/v1/coupon/coupons/' + code + '/info',
    method: 'get'
  })
}

/**
 * 导出优惠券
 */
export function exportCoupon (params) {
  return request({
    url: '/v1/coupon/coupons/export',
    method: 'get',
    params
  })
}

/**
 * 导出使用详情优惠券
 */
export function exportUseInfoCoupon (id, params) {
  return request({
    url: '/v1/coupon/coupons/' + id + '/usage/export',
    method: 'get',
    params
  })
}

/**
 * 获取分类
 */
export function getCouponCategory (params) {
  return request({
    url: '/v1/coupon/categories',
    method: 'get',
    params
  })
}
